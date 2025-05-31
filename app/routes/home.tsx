import { redirect } from "react-router/rsc";
import { z } from "zod/v4";
import { Feed } from "../components/feed";
import { api } from "../lib.server/api";
import { Route } from "./+types/home";
import { getSession } from "../lib.server/middleware";

export async function loader({ context, request }: Route.LoaderArgs) {
  const session = getSession(context);
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
    pages.map(
      (current) => api.get_posts("/topstories.json", hidden, current + 1),
    ),
  );

  return {
    stories: result.flatMap((p) => p.stories),
    page,
    has_more: result.at(-1)?.has_more ?? false,
  };
}

export async function action({ context, request }: Route.ActionArgs) {
  const session = await getSession(context);
  const formData = await request.clone().formData();
  const intent = formData.get("intent");

  const schema = z.discriminatedUnion('intent', [
	  z.object({
	    intent: z.literal("hide"),
	    id: z.coerce.number(),
		})
  ]);

  const result = schema.parse(Object.fromEntries(formData.entries()));

  switch (intent) {
    case "hide": {
      const hidden = session.get("hidden") || [];
      const hiddenSet = new Set(hidden);
      hiddenSet.add(result.id);
      session.set("hidden", Array.from(hiddenSet));

      throw redirect("/");
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

export function ServerComponent({ loaderData }: Route.ComponentProps) {
  return (
    <Feed
      stories={loaderData.stories}
      page={loaderData.page}
      hasMore={loaderData.has_more}
    />
  );
}
