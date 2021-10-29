import { MetaFunction, LoaderFunction, Link } from "remix";
import { useLoaderData } from "remix";
import { fetcher } from "@mcansh/fetcher";

import { HackerNewsItem } from "~/types";
import { formatDate } from "~/lib/format-date";

export let meta: MetaFunction = () => {
  return {
    title: "Remix Hacker News",
    description: "Hacker News made with Remix.run",
  };
};

type SlimHackerNewsItem = Pick<
  HackerNewsItem,
  "id" | "title" | "url" | "time" | "score" | "by" | "descendants"
>;
interface RouteData {
  data: SlimHackerNewsItem[];
}

export let loader: LoaderFunction = async () => {
  let ids = await fetcher<number[]>(
    "https://hacker-news.firebaseio.com/v0/topstories.json"
  );

  let data: HackerNewsItem[] = await Promise.all(
    ids
      .slice(0, 29)
      .map((id) =>
        fetcher<HackerNewsItem>(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json`
        )
      )
  );

  let slimData: SlimHackerNewsItem[] = data.map((item) => {
    return {
      id: item.id,
      title: item.title,
      url: item.url,
      time: item.time,
      score: item.score,
      by: item.by,
      descendants: item.descendants,
    };
  });

  let result: RouteData = {
    data: slimData,
  };

  return result;
};

export default function Index() {
  let data = useLoaderData<RouteData>();

  return (
    <div className="my-2.5 space-y-2.5 px-2.5 py-1">
      {data.data.map((story, index) => {
        let storyDate = new Date(story.time * 1000);
        let formatted = formatDate(storyDate);

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
                  <Link className="inline-block mr-2" to={`/item/${story.id}`}>
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
                <Link className="hover:underline" to={`/user/${story.by}`}>
                  {story.by}
                </Link>{" "}
                {formatted} |{" "}
                <Link className="hover:underline" to={`item/${story.id}`}>
                  {story.descendants} comments
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
