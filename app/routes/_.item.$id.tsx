import * as React from "react";
import { unstable_defineLoader } from "@remix-run/cloudflare";
import { Await, useLoaderData } from "@remix-run/react";
import type { MetaArgs_SingleFetch } from "@remix-run/react";
import { responseHelper } from "~/.server/utils";
import { api } from "~/.server/api";
import type { Comment } from "~/.server/api";

export const loader = unstable_defineLoader(async ({ params, response }) => {
  const id = Number(params.id);
  if (isNaN(id)) throw responseHelper(response, { status: 404 });

  const story = await api.get_post(id);
  const kids = api.get_comments(story.kids);

  const meta = [
    { title: `${story.title} | Remix Hacker News` },
    { name: "description", content: "Hacker News made with Remix.run" },
  ];

  return { story, meta, kids };
});

export function meta({ data }: MetaArgs_SingleFetch<typeof loader>) {
  return data?.meta ?? [];
}

export default function ItemPage() {
  const data = useLoaderData<typeof loader>();

  const commentText =
    data.story.descendants && data.story.descendants === 1
      ? "comment"
      : "comments";

  return (
    <div className="px-4 py-2">
      <h1 className="text-black">{data.story.title}</h1>

      <p className="text-xs">
        {data.story.score} points by {data.story.by} {data.story.relative_date}{" "}
        | {data.story.descendants} {commentText}
      </p>

      {data.story.text ? (
        <div
          className="mt-2 text-black"
          dangerouslySetInnerHTML={{ __html: data.story.text }}
        />
      ) : null}

      <React.Suspense
        fallback={<div className="mt-4">Loading Comments...</div>}
      >
        <Await resolve={data.kids}>
          {(comments) => {
            console.log({ comments });
            return <Comments comments={comments} />;
          }}
        </Await>
      </React.Suspense>
    </div>
  );
}

function Comments({
  comments,
  depth = 1,
}: {
  comments: Array<Comment> | undefined;
  depth?: number;
}) {
  if (!comments || comments.length === 0) return null;
  const marginLeft = depth === 1 ? 0 : depth * 4;

  return (
    <div className="mt-4 space-y-4" style={{ marginLeft }}>
      {comments.map((comment) => (
        <div key={comment.id}>
          <p>
            {comment.by} {comment.relative_date}
          </p>
          {comment.text ? (
            <div
              className="text-black"
              dangerouslySetInnerHTML={{ __html: comment.text }}
            />
          ) : null}
          {comment.kids == undefined || comment.kids.length === 0 ? null : (
            <Comments comments={comment.kids} depth={depth + 1} />
          )}
        </div>
      ))}
    </div>
  );
}
