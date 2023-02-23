import { Feed } from "~/components/feed";
import { api } from "~/lib/api";
import { json, MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

export async function loader() {
  let stories = await api.get_posts("/showstories.json");

  return json({ stories });
}

export const meta: MetaFunction = () => {
  return { title: "Show | Remix Hacker News" };
};

export default function ShowPage() {
  const data = useLoaderData<typeof loader>();
  return <Feed stories={data.stories} />;
}
