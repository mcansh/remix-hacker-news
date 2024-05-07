import type { MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { Feed } from "~/components/feed";
import { api } from "~/.server/api";

export let meta: MetaFunction = () => {
  return [
    { title: "Remix Hacker News" },
    { name: "description", content: "Hacker News made with Remix.run" },
  ];
};

export async function loader() {
  let stories = await api.get_posts("/topstories.json");
  return { stories };
}

export default function IndexPage() {
  const data = useLoaderData<typeof loader>();
  return <Feed stories={data.stories} />;
}
