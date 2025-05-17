import * as React from "react";
import type { Comment } from "~/lib.server/api";
import { api } from "~/lib.server/api";
import type { Route } from "./+types/item.$id";

export const loader = async ({ params }: Route.LoaderArgs) => {
  const id = Number(params.id);

  if (Number.isNaN(id)) {
    throw new Response("Not Found", { status: 404, statusText: "Not Found" });
  }

  const story = await api.get_post(id);
  const kids = api.get_comments(story.kids);

  const meta = [
    { title: `${story.title} | Remix Hacker News` },
    { name: "description", content: "Hacker News made with Remix.run" },
  ];

  return { story, meta, kids };
};

export function meta({ data }: Route.MetaArgs): Route.MetaDescriptors {
  return data?.meta ?? [];
}

export default function ItemPage({ loaderData }: Route.ComponentProps) {
  const comments = React.use(loaderData.kids);

  return (
    <div className="px-4 py-2">
      <h1 className="text-black">{loaderData.story.title}</h1>

      <p className="text-xs">
        {loaderData.story.score}{" "}
        {loaderData.story.score === 1 ? "point" : "points"} by{" "}
        {loaderData.story.by} {loaderData.story.relative_date} |{" "}
        {loaderData.story.descendants}{" "}
        {loaderData.story.descendants === 1 ? "comment" : "comments"}
      </p>

      {loaderData.story.text ? (
        <div
          className="mt-2 text-black"
          dangerouslySetInnerHTML={{ __html: loaderData.story.text }}
        />
      ) : null}

      <React.Suspense
        fallback={<div className="mt-4">Loading Comments...</div>}
      >
        <Comments comments={comments} />
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
