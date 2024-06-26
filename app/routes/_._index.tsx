import type { MetaFunction } from "@remix-run/cloudflare";
import {
  unstable_defineAction,
  unstable_defineLoader,
} from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { cacheHeader } from "pretty-cache-header";
import { Feed } from "~/components/feed";
import { api } from "~/.server/api";

export const meta: MetaFunction = () => {
  return [
    { title: "Remix Hacker News" },
    { name: "description", content: "Hacker News made with Remix.run" },
  ];
};

export const loader = unstable_defineLoader(
  async ({ context, request, response }) => {
    const cookie = request.headers.get("Cookie");
    const session = await context.sessionStorage.getSession(cookie);
    const url = new URL(request.url);

    const pageParam = url.searchParams.get("page");

    if (pageParam && pageParam === "1") {
      response.status = 302;
      response.headers.set("Location", "/");
      throw response;
    }

    const page = Number(pageParam) || 1;

    const hidden = session.get("hidden") || [];
    const { has_more, stories } = await api.get_posts(
      "/topstories.json",
      hidden,
      page,
    );

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

    return { stories, page, has_more };
  },
);

export const action = unstable_defineAction(
  async ({ context, request, response }) => {
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

        response.status = 302;
        response.headers.append(
          "Set-Cookie",
          await context.sessionStorage.commitSession(session),
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
  },
);

export default function IndexPage() {
  const data = useLoaderData<typeof loader>();
  return (
    <Feed stories={data.stories} page={data.page} hasMore={data.has_more} />
  );
}
