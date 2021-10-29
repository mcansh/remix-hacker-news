import {
  RouteComponent,
  LoaderFunction,
  MetaFunction,
  useLoaderData,
} from "remix";

import { SlimHackerNewsItem } from "~/types";
import { Feed } from "~/components/feed";
import { api } from "~/lib/api";

interface RouteData {
  stories: SlimHackerNewsItem[];
}

const loader: LoaderFunction = async () => {
  let stories = await api("/showstories.json");

  let result: RouteData = {
    stories,
  };

  return result;
};

const meta: MetaFunction = () => ({
  title: "Show | Remix Hacker News",
});

const ShowPage: RouteComponent = () => {
  const data = useLoaderData<RouteData>();
  return <Feed stories={data.stories} />;
};

export default ShowPage;
export { loader, meta };
