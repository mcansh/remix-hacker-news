import { MetaFunction, LoaderFunction, Link, RouteComponent } from "remix";
import { useLoaderData } from "remix";
import { fetcher } from "@mcansh/fetcher";

import { HackerNewsItem } from "~/types/hackernews";
import { SlimHackerNewsItem } from "~/types";
import { Feed } from "~/components/feed";

let meta: MetaFunction = () => {
  return {
    title: "Remix Hacker News",
    description: "Hacker News made with Remix.run",
  };
};

interface RouteData {
  stories: SlimHackerNewsItem[];
}

let loader: LoaderFunction = async () => {
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
    stories: slimData,
  };

  return result;
};

const IndexPage: RouteComponent = () => {
  let data = useLoaderData<RouteData>();
  return <Feed stories={data.stories} />;
};

export default IndexPage;
export { loader, meta };
