import { cacheHeader } from "pretty-cache-header";
import { data, redirect } from "react-router";
import { z } from "zod/v4";
import { Feed } from "~/components/feed";
import { api } from "~/lib.server/api";
import { sessionStorage } from "~/lib.server/session";
import type { Route } from "./+types/home";

export async function loader({ request }: Route.LoaderArgs) {
  const cookie = request.headers.get("Cookie");
  const session = await sessionStorage.getSession(cookie);
  const url = new URL(request.url);

  const pageParam = url.searchParams.get("page");

  if (pageParam && pageParam === "1") {
    throw redirect("/");
  }

  const page = Number(pageParam) || 1;

  const hidden = session.get("hidden") || [];
  const { has_more, stories } = await api.get_posts(
    "/topstories.json",
    hidden,
    page,
  );

  let headers = new Headers();

  headers.append(
    "Cache-Control",
    cacheHeader({ public: true, maxAge: "0m", mustRevalidate: true }),
  );

  headers.append(
    "cdn-cache-control",
    cacheHeader({ public: true, sMaxage: "60s", staleWhileRevalidate: "1w" }),
  );

  return data({ stories, page, has_more }, { headers });
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

export async function action({ request }: Route.ActionArgs) {
  const cookie = request.headers.get("Cookie");
  const session = await sessionStorage.getSession(cookie);
  const formData = await request.formData();
  const intent = formData.get("intent");

  const schema = z.object({
    intent: z.string(),
    id: z.coerce.number(),
  });

  const result = schema.parse(Object.fromEntries(formData.entries()));

  switch (intent) {
    case "hide": {
      const hidden = session.get("hidden") || [];
      const hiddenSet = new Set(hidden);
      hiddenSet.add(result.id);
      session.set("hidden", Array.from(hiddenSet));

      throw redirect("/", {
        headers: {
          "Set-Cookie": await sessionStorage.commitSession(session),
        },
      });
    }

    default: {
      console.error("Invalid intent", intent);
      throw new Response("Invalid intent", { status: 422 });
    }
  }
}

export function meta() {
  return [
    { title: "Remix Hacker News" },
    { name: "description", content: "Hacker News made with Remix.run" },
  ];
}

export default function IndexPage({ loaderData }: Route.ComponentProps) {
  return (
    <Feed
      stories={loaderData.stories}
      page={loaderData.page}
      hasMore={loaderData.has_more}
    />
  );
}
