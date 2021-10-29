import {
  RouteComponent,
  LoaderFunction,
  MetaFunction,
  useLoaderData,
} from "remix";
import { fetcher } from "@mcansh/fetcher";

import { SlimHackerNewsItem } from "~/types";
import { HackerNewsItem } from "~/types/hackernews";
import { Feed } from "~/components/feed";

interface RouteData {
  stories: SlimHackerNewsItem[];
}

const loader: LoaderFunction = async () => {
  let ids = await fetcher<number[]>(
    "https://hacker-news.firebaseio.com/v0/newstories.json"
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

const meta: MetaFunction = () => ({
  title: "New Links | Remix Hacker News",
});

const NewestPage: RouteComponent = () => {
  const data = useLoaderData<RouteData>();
  return <Feed stories={data.stories} />;
};

export default NewestPage;
export { loader, meta };
