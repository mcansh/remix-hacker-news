import { Feed } from "~/components/feed";
import { api } from "~/lib.server/api";
import type { Route } from "./+types/show";

export const loader = async () => {
  const { stories } = await api.get_posts("/showstories.json");

  return { stories };
};

export const meta = (): Route.MetaDescriptors => {
  return [
    { title: "Show | Remix Hacker News" },
    { name: "description", content: "Hacker News made with Remix.run" },
  ];
};

export default function ShowPage({ loaderData }: Route.ComponentProps) {
  return <Feed stories={loaderData.stories} />;
}
