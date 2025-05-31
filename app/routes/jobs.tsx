import { Feed } from "../components/feed";
import { api } from "../lib.server/api";
import type { Route } from "./+types/jobs";

export const loader = async () => {
  const { stories } = await api.get_posts("/jobstories.json");

  return { stories };
};

export const meta = (): Route.MetaDescriptors => {
  return [
    { title: "Jobs | Remix Hacker News" },
    { name: "description", content: "Hacker News made with Remix.run" },
  ];
};

export function ServerComponent({ loaderData }: Route.ComponentProps) {
  return <Feed stories={loaderData.stories} />;
}
