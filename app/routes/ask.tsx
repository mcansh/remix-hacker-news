import { Feed } from "~/components/feed";
import { api } from "~/lib.server/api";
import type { Route } from "./+types/ask";

export const loader = async () => {
  let { stories } = await api.get_posts("/askstories.json", [], 1);

  return { stories };
};

export function meta() {
  return [
    { title: "Ask | Remix Hacker News" },
    { name: "description", content: "Hacker News made with Remix.run" },
  ];
}

export default function AskPage({ loaderData }: Route.ComponentProps) {
  return <Feed stories={loaderData.stories} />;
}
