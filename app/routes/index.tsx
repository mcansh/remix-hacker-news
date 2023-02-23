import { SlimHackerNewsItem } from "~/types";
import { Feed } from "~/components/feed";
import { api } from "~/lib/api";
import { MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

export let meta: MetaFunction = () => {
  return {
    title: "Remix Hacker News",
    description: "Hacker News made with Remix.run",
  };
};

interface RouteData {
  stories: SlimHackerNewsItem[];
}

export async function loader() {
  let stories = await api("/topstories.json");

  let result: RouteData = { stories };

  return result;
}

export default function IndexPage() {
  const data = useLoaderData<typeof loader>();
  return <Feed stories={data.stories} />;
}
