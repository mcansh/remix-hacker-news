import type { MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { Feed } from "~/components/feed";
import { api } from "~/.server/api";

export async function loader() {
  let stories = await api.get_posts("/jobstories.json");
  return { stories };
}

export const meta: MetaFunction = () => {
  return [
    { title: "Jobs | Remix Hacker News" },
    { name: "description", content: "Hacker News made with Remix.run" },
  ];
};

export default function JobsPage() {
  const data = useLoaderData<typeof loader>();
  return <Feed stories={data.stories} />;
}
