import type { MetaFunction } from "@remix-run/cloudflare";
import {
  unstable_defineAction,
  unstable_defineLoader,
} from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { Feed } from "~/components/feed";
import { api } from "~/.server/api";
import { sessionStorage } from "~/.server/session";
import { z } from "zod";

export const meta: MetaFunction = () => {
  return [
    { title: "Remix Hacker News" },
    { name: "description", content: "Hacker News made with Remix.run" },
  ];
};

export const loader = unstable_defineLoader(async ({ request }) => {
  let session = await sessionStorage.getSession(request.headers.get("Cookie"));
  let url = new URL(request.url);

  let page = Number(url.searchParams.get("page")) || 1;

  let hidden = session.get("hidden") || [];
  const { has_more, stories } = await api.get_posts(
    "/topstories.json",
    hidden,
    page,
  );
  return { stories, page, has_more };
});

export const action = unstable_defineAction(async ({ request, response }) => {
  let session = await sessionStorage.getSession(request.headers.get("Cookie"));
  let formData = await request.formData();
  let intent = formData.get("intent");

  let schema = z.object({
    intent: z.string(),
    id: z.coerce.number(),
  });

  let result = schema.parse(Object.fromEntries(formData.entries()));

  switch (intent) {
    case "hide": {
      let hidden = session.get("hidden") || [];
      let hiddenSet = new Set(hidden);
      hiddenSet.add(result.id);
      session.set("hidden", Array.from(hiddenSet));

      response.status = 302;
      response.headers.append(
        "Set-Cookie",
        await sessionStorage.commitSession(session),
      );
      response.headers.set("Location", "/");
      throw response;
    }
    default: {
      console.error("Invalid intent", intent);
      response.status = 422;
      throw response;
    }
  }
});

export default function IndexPage() {
  const data = useLoaderData<typeof loader>();
  return (
    <Feed stories={data.stories} page={data.page} hasMore={data.has_more} />
  );
}
