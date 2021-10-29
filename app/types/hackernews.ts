export interface HackerNewsItem {
  by: string;
  descendants?: number;
  id: number;
  kids?: number[];
  score: number;
  time: number;
  title: string;
  type: HackerNewsItemType;
  url?: string;
  text?: string;
}

export type HackerNewsItemType =
  | "job"
  | "story"
  | "comment"
  | "poll"
  | "pollopt";

export interface HackerNewsUser {
  id: string;
  created: number;
  karma: number;
  about: string;
  submitted: number[];
}
