import { MetaFunction, LoaderFunction, RouteComponent } from "remix";
import { useLoaderData } from "remix";

import { SlimHackerNewsItem } from "~/types";
import { Feed } from "~/components/feed";
import { api } from "~/lib/api";

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
  let stories = await api("/topstories.json");

  let result: RouteData = {
    stories,
  };

  return result;
};

const IndexPage: RouteComponent = () => {
  let data = useLoaderData<RouteData>();
  return <Feed stories={data.stories} />;
};

export default IndexPage;
export { loader, meta };
