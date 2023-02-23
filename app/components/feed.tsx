import { Link } from "@remix-run/react";
import { HackerNewsItem } from "~/lib/api";

interface Props {
  stories: Array<HackerNewsItem>;
}

export function Feed({ stories }: Props) {
  return (
    <div className="my-2.5 space-y-2.5 px-2.5 py-1">
      {stories.map((story, index) => {
        let commentText =
          story.descendants && story.descendants === 1 ? "comment" : "comments";

        return (
          <div key={story.id} className="flex space-x-2.5">
            <span className="text-neutral-400 text-sm pt-0.5">
              {index + 1}.
            </span>
            <div>
              <div>
                {story.url ? (
                  <a className="inline-block mr-2" href={story.url}>
                    {story.title}
                  </a>
                ) : (
                  <Link
                    prefetch="intent"
                    className="inline-block mr-2"
                    to={`/item/${story.id}`}
                  >
                    {story.title}
                  </Link>
                )}
                {story.url && (
                  <span className="text-sm hover:underline text-neutral-400">
                    {new URL(story.url).hostname}
                  </span>
                )}
              </div>
              <div className="text-sm text-neutral-400">
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
                  to={`item/${story.id}`}
                >
                  {story.descendants} {commentText}
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
