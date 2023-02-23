import { DataFunctionArgs, json } from "@remix-run/cloudflare";
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

export default function ItemPage() {
  let data = useLoaderData<typeof loader>();

  let commentText =
    data.story.descendants && data.story.descendants === 1
      ? "comment"
      : "comments";

  return (
    <div className="py-2 px-4 text-gray-500">
      <h1 className="text-black">{data.story.title}</h1>
      <p className="text-xs">
        {data.story.score} points by {data.story.by} {data.story.relative_date}{" "}
        | {data.story.descendants} {commentText}
      </p>
      <div
        className="mt-2 prose max-w-none"
        dangerouslySetInnerHTML={{ __html: data.story.text }}
      />

      <div className="mt-4 space-y-4 ml-10">
        {data.story.kids?.map((kid: any) => {
          return (
            <div key={kid}>
              <p>
                {kid.by} {kid.relative_date}
              </p>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: kid.text,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
