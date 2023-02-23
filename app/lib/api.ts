import * as timeago from "time-ago";
import { z } from "zod";
import { createZodFetcher } from "zod-fetch";
import sanitizeHtml from "sanitize-html";

let zetch = createZodFetcher();

let hacker_news_item_schema = z.object({
  by: z.string(),
  descendants: z.number().optional(),
  id: z.number(),
  kids: z.array(z.number()).optional(),
  score: z.number(),
  time: z.number(),
  title: z.string(),
  type: z.enum(["job", "story", "poll", "pollopt"]),
  url: z.string().optional(),
  text: z.string().optional(),
});

let hacker_news_user_schema = z.object({
  id: z.string(),
  created: z.number(),
  karma: z.number(),
  about: z.string().optional(),
  submitted: z.array(z.number()),
});

let hacker_news_comment_schema = z.object({
  by: z.string().optional(),
  id: z.number(),
  kids: z.array(z.number()).optional(),
  parent: z.number(),
  text: z.string().optional(),
  time: z.number(),
  type: z.enum(["comment"]),
});

type Endpoint =
  | "/askstories.json"
  | "/topstories.json"
  | "/jobstories.json"
  | "/newstories.json"
  | "/showstories.json";

let base_url = "https://hacker-news.firebaseio.com";

function formatPath(string: string) {
  let parts = string.split("/");
  if (parts[0] !== "v0") parts.unshift("v0");
  return "/" + parts.filter(Boolean).join("/");
}

function get_url(path: string) {
  return new URL(formatPath(path), base_url);
}

export const api = {
  async get_user(username: string) {
    let url = get_url(`/user/${username}.json`);
    url.searchParams.set("print", "pretty");
    let user = await zetch(hacker_news_user_schema, url.toString());
    let about = user.about ? sanitizeHtml(user.about) : "";

    let data = await Promise.all(
      user.submitted.slice(0, 29).map((id) => {
        return zetch(
          hacker_news_item_schema,
          get_url(`/item/${id}.json`).toString()
        );
      })
    );

    let posts = data.map((item) => {
      return get_data_from_post(item);
    });

    return { user: { ...user, about }, posts };
  },

  async get_posts(endpoint: Endpoint) {
    let url = get_url(endpoint);
    let ids = await zetch(z.array(z.number()), url.toString());

    let critical_ids = ids.slice(0, 29);

    let data = await Promise.all(
      critical_ids.map((id) =>
        zetch(hacker_news_item_schema, get_url(`/item/${id}.json`).toString())
      )
    );

    return data.map((item) => {
      return get_data_from_post(item);
    });
  },

  async get_post(id: number) {
    let story = await zetch(
      hacker_news_item_schema,
      get_url(`/item/${id}.json`).toString()
    );

    let kids = story.kids ? await recursively_get_kids(story.kids) : [];

    return {
      ...story,
      text: story.text ? sanitizeHtml(story.text) : undefined,
      relative_date: timeago.ago(story.time * 1000),
      kids,
    };
  },
};

export type HackerNewsUser = Awaited<ReturnType<typeof api.get_user>>;
export type HackerNewsItem = Awaited<ReturnType<typeof api.get_posts>>[number];
export type HackerNewsComment = z.infer<typeof hacker_news_comment_schema>;
export type HackerNewsFullComment = Omit<HackerNewsComment, "kids"> & {
  kids: Array<HackerNewsFullComment> | undefined;
} & { relative_date: string };

export function get_data_from_post(
  item: z.infer<typeof hacker_news_item_schema>
) {
  return {
    id: item.id,
    title: item.title,
    url: item.url,
    relative_date: timeago.ago(item.time * 1000),
    score: item.score,
    by: item.by,
    descendants: item.descendants,
  };
}

async function get_comment(id: number) {
  let item = await zetch(
    hacker_news_comment_schema,
    get_url(`/item/${id}.json`).toString()
  );

  return {
    ...item,
    text: item.text ? sanitizeHtml(item.text) : undefined,
    relative_date: timeago.ago(item.time * 1000),
  };
}

async function recursively_get_kids(
  commentIds: Array<number>
): Promise<Array<HackerNewsFullComment>> {
  let commentsToFetch = commentIds.slice(0, 4);
  let comments = await Promise.all(commentsToFetch.map(get_comment));

  let kids = await Promise.all(
    comments.map(async (comment) => {
      if (comment.kids) {
        return recursively_get_kids(comment.kids);
      }
    })
  );

  return comments.map((comment, i) => {
    return {
      ...comment,
      kids: kids[i]?.filter((item) => !is_sus_comment(item)),
    };
  });
}

function is_sus_comment(item: HackerNewsFullComment) {
  return item.by == undefined || item.text == undefined;
}
