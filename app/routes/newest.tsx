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
import { api } from "~/lib/api";

interface RouteData {
  stories: SlimHackerNewsItem[];
}

const loader: LoaderFunction = async () => {
  let stories = await api("/newstories.json");

  let result: RouteData = {
    stories,
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
