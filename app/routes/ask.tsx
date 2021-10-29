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
  let stories = await api("/askstories.json");

  let result: RouteData = { stories };

  return result;
};

const meta: MetaFunction = () => ({
  title: "Ask | Remix Hacker News",
});

const AskPage: RouteComponent = () => {
  const data = useLoaderData<RouteData>();
  return <Feed stories={data.stories} />;
};

export default AskPage;
export { loader, meta };
