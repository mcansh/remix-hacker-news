import { HackerNewsItem } from "./hackernews";

export type SlimHackerNewsItem = Pick<
  HackerNewsItem,
  "id" | "title" | "url" | "time" | "score" | "by" | "descendants"
>;
