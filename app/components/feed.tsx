import { Link } from "@remix-run/react";
import type { Post } from "~/.server/api";

interface Props {
  stories: Array<Post>;
}

export function Feed({ stories }: Props) {
  return (
    <div className="my-2.5 space-y-2.5 px-2.5 py-1">
      {stories.map((story, index) => {
        const commentText =
          story.descendants && story.descendants === 1 ? "comment" : "comments";

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
                {story.score} points by{" "}
                <Link
                  prefetch="intent"
                  className="hover:underline"
                  to={`/user/${story.by}`}
                >
                  {story.by}
                </Link>{" "}
                {story.relative_date}
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
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
