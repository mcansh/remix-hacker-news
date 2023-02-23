import { SlimHackerNewsItem } from "~/types";
import { Feed } from "~/components/feed";
import { api } from "~/lib/api";
import { MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

interface RouteData {
  stories: SlimHackerNewsItem[];
}

export async function loader() {
  let stories = await api("/askstories.json");

  let result: RouteData = { stories };

  return result;
}

export const meta: MetaFunction = () => {
  return {
    title: "Ask | Remix Hacker News",
  };
};

export default function AskPage() {
  const data = useLoaderData<typeof loader>();
  return <Feed stories={data.stories} />;
}
