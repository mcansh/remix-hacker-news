import { Form, Link } from "@remix-run/react";
import type { Feed } from "~/.server/api";

interface Props {
  stories: Feed;
}

export function Feed({ stories }: Props) {
  return (
    <div className="my-2.5 space-y-2.5 px-2.5 py-1">
      {stories.map((story, index) => {
        const commentText =
          story.descendants && story.descendants === 1 ? "comment" : "comments";
        let pointsText = story.score === 1 ? "point" : "points";

        return (
          <div key={story.id} className="flex space-x-2.5">
            <span className="text-sm">{index + 1}.</span>
            <div>
              <div>
                {story.url ? (
                  <a className="mr-2 inline-block text-black" href={story.url}>
                    {story.title}
                  </a>
                ) : (
                  <Link
                    prefetch="intent"
                    className="mr-2 inline-block text-black"
                    to={`/item/${story.id}`}
                  >
                    {story.title}
                  </Link>
                )}
                {story.url ? (
                  <>
                    (
                    <span className="text-sm hover:underline">
                      {new URL(story.url).hostname}
                    </span>
                    )
                  </>
                ) : null}
              </div>
              <div className="text-neutral-400 text-subtext">
                {story.score} {pointsText} by{" "}
                <Link
                  prefetch="intent"
                  className="hover:underline"
                  to={`/user/${story.by}`}
                >
                  {story.by}
                </Link>{" "}
                {story.relative_date}
                {" | "}
                {story.type === "job" ? (
                  <Form method="post" className="inline">
                    <input type="hidden" name="id" value={story.id} />
                    <button
                      className="text-neutral-400 hover:underline"
                      name="intent"
                      value="hide"
                      type="submit"
                    >
                      hide
                    </button>
                  </Form>
                ) : (
                  <Link
                    prefetch="intent"
                    className="hover:underline"
                    to={`/item/${story.id}`}
                  >
                    {story.descendants === 0
                      ? "discuss"
                      : `${story.descendants} ${commentText}`}
                  </Link>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
