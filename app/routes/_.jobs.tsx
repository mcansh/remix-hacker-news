import type { MetaFunction } from "@remix-run/cloudflare";
import { unstable_defineLoader } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { Feed } from "~/components/feed";
import { api } from "~/.server/api";
import { CacheHeaders } from "cdn-cache-control";

export const loader = unstable_defineLoader(async ({ response }) => {
  const { stories } = await api.get_posts("/jobstories.json");

  for (const [header, value] of new CacheHeaders().swr().ttl(60)) {
    response.headers.append(header, value);
  }

  return { stories };
});

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
