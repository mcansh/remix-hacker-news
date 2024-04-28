import type { MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { Feed } from "~/components/feed";
import { api } from "~/.server/api";

export async function loader() {
  let stories = await api.get_posts("/askstories.json");
  return { stories };
}

export const meta: MetaFunction = () => {
  return [
    { title: "Ask | Remix Hacker News" },
    { name: "description", content: "Hacker News made with Remix.run" },
  ];
};

export default function AskPage() {
  const data = useLoaderData<typeof loader>();
  return <Feed stories={data.stories} />;
}
