import { Form, Link } from "@remix-run/react";
import type { Feed } from "~/.server/api";

type Props =
  | {
      stories: Feed;
      hasMore?: never;
      page?: never;
    }
  | {
      hasMore: boolean;
      page: number;
      stories: Feed;
    };

export function Feed({ hasMore, page, stories }: Props) {
  return (
    <div className="my-2.5 space-y-2.5 px-2.5 py-1">
      {stories.map((story, index) => {
        const commentText =
          story.descendants && story.descendants === 1 ? "comment" : "comments";
        let pointsText = story.score === 1 ? "point" : "points";

        return (
          <div key={story.id} className="flex space-x-2.5">
            <span className="text-sm">{story.number}.</span>
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
                {story.descendants ? (
                  <>
                    {" | "}
                    <Link
                      prefetch="intent"
                      className="hover:underline"
                      to={`/item/${story.id}`}
                    >
                      {story.descendants === 0
                        ? "discuss"
                        : `${story.descendants} ${commentText}`}
                    </Link>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}

      {hasMore ? (
        <Link
          prefetch="intent"
          to={{ search: `?page=${page + 1}` }}
          className="ml-8 mt-8 block text-black"
        >
          More
        </Link>
      ) : null}
    </div>
  );
}
