import { Feed } from "~/components/feed";
import { api } from "~/lib/api";
import { json, MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

export async function loader() {
  let stories = await api.get_posts("/jobstories.json");
  return json({ stories });
}

export const meta: MetaFunction = () => {
  return { title: "Jobs | Remix Hacker News" };
};

export default function JobsPage() {
  const data = useLoaderData<typeof loader>();
  return <Feed stories={data.stories} />;
}
