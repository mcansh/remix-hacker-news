import { fetcher } from "@mcansh/fetcher";

import { SlimHackerNewsItem } from "~/types";
import { HackerNewsItem } from "~/types/hackernews";

function formatPath(string: string) {
  let parts = string.split("/");
  parts.unshift("v0");

  return "/" + parts.filter(Boolean).join("/");
}

async function api(endpoint: string) {
  let path = formatPath(endpoint);
  let url = new URL(path, "https://hacker-news.firebaseio.com");

  let ids = await fetcher<number[]>(url.toString());

  let data: HackerNewsItem[] = await Promise.all(
    ids
      .slice(0, 29)
      .map((id) =>
        fetcher<HackerNewsItem>(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json`
        )
      )
  );

  let slimData: SlimHackerNewsItem[] = data.map((item) => {
    return {
      id: item.id,
      title: item.title,
      url: item.url,
      time: item.time,
      score: item.score,
      by: item.by,
      descendants: item.descendants,
    };
  });

  return slimData;
}

export { api };
