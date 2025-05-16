import { cacheHeader } from "pretty-cache-header";
import { data } from "react-router";
import { Feed } from "~/components/feed";
import { api } from "~/lib.server/api";
import type { Route } from "./+types/show";

export const loader = async () => {
  const { stories } = await api.get_posts("/showstories.json");

  let headers = new Headers();

  headers.append(
    "Cache-Control",
    cacheHeader({
      public: true,
      maxAge: "0m",
      mustRevalidate: true,
    }),
  );

  headers.append(
    "cdn-cache-control",
    cacheHeader({
      public: true,
      sMaxage: "60s",
      staleWhileRevalidate: "1w",
    }),
  );

  return data({ stories }, { headers });
};

export function headers({
  loaderHeaders,
}: Route.HeadersArgs): Headers | HeadersInit {
  let value = new Headers();
  let cacheControl = loaderHeaders.get("Cache-Control");
  let cdnCacheControl = loaderHeaders.get("cdn-cache-control");
  if (cacheControl) value.append("Cache-Control", cacheControl);
  if (cdnCacheControl) value.append("cdn-cache-control", cdnCacheControl);
  return value;
}

export const meta = (): Route.MetaDescriptors => {
  return [
    { title: "Show | Remix Hacker News" },
    { name: "description", content: "Hacker News made with Remix.run" },
  ];
};

export default function ShowPage({ loaderData }: Route.ComponentProps) {
  return <Feed stories={loaderData.stories} />;
}
