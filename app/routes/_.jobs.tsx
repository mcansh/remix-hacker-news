import type { MetaFunction } from "@remix-run/cloudflare";
import { unstable_defineLoader } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { cacheHeader } from "pretty-cache-header";
import { Feed } from "~/components/feed";
import { api } from "~/.server/api";

export const loader = unstable_defineLoader(async ({ response }) => {
  const { stories } = await api.get_posts("/jobstories.json");

  response.headers.append(
    "Cache-Control",
    cacheHeader({
      public: true,
      maxAge: "0m",
      mustRevalidate: true,
    }),
  );
  response.headers.append(
    "cdn-cache-control",
    cacheHeader({
      public: true,
      sMaxage: "60s",
      staleWhileRevalidate: "1w",
    }),
  );

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
