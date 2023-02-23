import { Feed } from "~/components/feed";
import { api } from "~/lib/api";
import { json, MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

export let meta: MetaFunction = () => {
  return {
    title: "Remix Hacker News",
    description: "Hacker News made with Remix.run",
  };
};

export async function loader() {
  let stories = await api.get_posts("/topstories.json");
  return json({ stories });
}

export default function IndexPage() {
  const data = useLoaderData<typeof loader>();
  return <Feed stories={data.stories} />;
}
