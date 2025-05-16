import { format } from "date-fns";
import { cacheHeader } from "pretty-cache-header";
import { data } from "react-router";
import { api } from "~/lib.server/api";
import type { Route } from "./+types/user.$username";

export async function loader({ params }: Route.LoaderArgs) {
  const { user } = await api.get_user(params.username);
  const meta = [
    { title: `${user.id} | Remix Hacker News` },
    { name: "description", content: "Hacker News made with Remix.run" },
  ];

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

  return data({ user, meta }, { headers });
}

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

export function meta({ data }: Route.MetaArgs) {
  return data?.meta ?? [];
}

export default function NewestPage({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <div>user: {loaderData.user.id}</div>
      <div>
        created: {format(loaderData.user.created * 1000, "MMMM dd, yyyy")}
      </div>
      <div>karma: {loaderData.user.karma}</div>
      <div>
        <p>about:</p>
        <div dangerouslySetInnerHTML={{ __html: loaderData.user.about }} />
      </div>
    </div>
  );
}
