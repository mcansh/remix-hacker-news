import { redirect } from "react-router";
import { z } from "zod/v4";
import { Feed } from "~/components/feed";
import { api } from "~/lib.server/api";
import type { Route } from "./+types/home";

export async function loader({ context, request }: Route.LoaderArgs) {
  const cookie = request.headers.get("Cookie");
  const session = await context.sessionStorage.getSession(cookie);
  const url = new URL(request.url);

  const pageParam = url.searchParams.get("page");

  if (pageParam && pageParam === "1") {
    url.searchParams.delete("page");
    throw redirect(url.toString());
  }

  const page = Number(pageParam) || 1;

  const hidden = session.get("hidden") || [];
  let pages = [...Array.from({ length: page }).keys()];
  const result = await Promise.all(
    pages.map((current) =>
      api.get_posts("/topstories.json", hidden, current + 1),
    ),
  );

  return {
    stories: result.flatMap((p) => p.stories),
    page,
    has_more: result.at(-1)?.has_more ?? false,
  };
}

export async function action({ context, request }: Route.ActionArgs) {
  const cookie = request.headers.get("Cookie");
  const session = await context.sessionStorage.getSession(cookie);
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
          "Set-Cookie": await context.sessionStorage.commitSession(session),
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
