import { unstable_defineLoader } from "@remix-run/cloudflare";
import type { MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { api } from "~/.server/api";
import { Feed } from "~/components/feed";

export const loader = unstable_defineLoader(async () => {
  const stories = await api.get_posts("/showstories.json");
  return { stories };
});

export const meta: MetaFunction = () => {
  return [
    { title: "Show | Remix Hacker News" },
    { name: "description", content: "Hacker News made with Remix.run" },
  ];
};

export default function ShowPage() {
  const data = useLoaderData<typeof loader>();
  return <Feed stories={data.stories} />;
}