import { DataFunctionArgs, json, MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { api } from "~/lib/api";

export async function loader({ params }: DataFunctionArgs) {
  if (!params.id) {
    throw new Response("Not found", { status: 404 });
  }

  let id = Number(params.id);

  if (isNaN(id)) {
    throw new Response("Not found", { status: 404 });
  }

  let story = await api.get_post(id);

  return json({ story });
}

export let meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) return {};
  return {
    title: `${data.story.title} | Remix Hacker News`,
  };
};

export default function ItemPage() {
  let data = useLoaderData<typeof loader>();

  console.log(data.story);

  let commentText =
    data.story.descendants && data.story.descendants === 1
      ? "comment"
      : "comments";

  return (
    <div className="py-2 px-4">
      <h1 className="text-black">{data.story.title}</h1>
      <p className="text-xs">
        {data.story.score} points by {data.story.by} {data.story.relative_date}{" "}
        | {data.story.descendants} {commentText}
      </p>
      <div
        className="mt-2 text-black"
        dangerouslySetInnerHTML={{ __html: data.story.text }}
      />

      <Comments comments={data.story.kids} />
    </div>
  );
}

function Comments({
  comments,
  depth = 1,
}: {
  comments: Array<any> | undefined;
  depth?: number;
}) {
  if (!comments || comments.length === 0) return null;

  return (
    <div
      className="mt-4 space-y-4"
      style={{
        marginLeft: `${depth * 10}px`,
      }}
    >
      {comments.map((comment) => {
        return (
          <div key={comment.id}>
            <p>
              {comment.by} {comment.relative_date}
            </p>
            <div
              className="text-black"
              dangerouslySetInnerHTML={{ __html: comment.text }}
            />
            {comment.kids == undefined || comment.kids.length === 0 ? null : (
              <Comments comments={comment.kids} depth={depth + 1} />
            )}
          </div>
        );
      })}
    </div>
  );
}
