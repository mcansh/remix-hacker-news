import { HackerNewsItem } from "./hackernews";

type SlimHackerNewsItem = Pick<
  HackerNewsItem,
  "id" | "title" | "url" | "time" | "score" | "by" | "descendants"
>;

export { SlimHackerNewsItem };
