"use server";
import type { Cache, CacheEntry } from "@epic-web/cachified";
import { cachified, totalTtl } from "@epic-web/cachified";
import { throwIfHttpError } from "fetch-extras";
import { LRUCache } from "lru-cache";
import * as timeago from "time-ago";
import { z } from "zod/v4";

/* lru cache is not part of this package but a simple non-persistent cache */
const lruInstance = new LRUCache<string, CacheEntry>({ max: 1000 });

const lru: Cache = {
  set(key, value) {
    const ttl = totalTtl(value?.metadata);
    return lruInstance.set(key, value, {
      ttl: ttl === Infinity ? undefined : ttl,
      start: value?.metadata?.createdTime,
    });
  },
  get(key) {
    return lruInstance.get(key);
  },
  delete(key) {
    return lruInstance.delete(key);
  },
};

function cachedFetch<Schema extends z.ZodTypeAny>(
  url: string | URL | Request,
  schema: Schema,
) {
  let key =
    url instanceof URL ? url.href : url instanceof Request ? url.url : url;
  return cachified({
    key,
    cache: lru,
    async getFreshValue() {
      console.log(`Fetching fresh value for ${key}`);
      const response = await throwIfHttpError(fetch(url));
      let data = await response.json();
      return schema.parse(data);
    },
    ttl: 120_000 /* Two minutes */,
    staleWhileRevalidate: 300_000 /* Five minutes */,
  });
}

const PostSchema = z.object({
  by: z.string(),
  descendants: z.number().optional(),
  id: z.number(),
  kids: z.array(z.number()).optional(),
  score: z.number(),
  time: z.number(),
  title: z.string(),
  type: z.enum(["job", "story", "poll", "pollopt", "comment"]),
  url: z.string().optional(),
  text: z.string().optional(),
});

const UserSchema = z.object({
  id: z.string(),
  created: z.number(),
  karma: z.number(),
  about: z.string().optional(),
  submitted: z.array(z.number()),
});

const CommentSchema = z.object({
  by: z.string().optional(),
  id: z.number(),
  kids: z.array(z.number()).optional(),
  parent: z.number(),
  text: z.string().optional(),
  time: z.number(),
  type: z.literal("comment"),
});

export type Post = z.infer<typeof PostSchema> & {
  relative_date: string;
};

export type Feed = Array<Omit<Post, "text" | "kids"> & { number: number }>;

type CommentNoKids = Omit<z.infer<typeof CommentSchema>, "kids">;

export type Comment = CommentNoKids & {
  kids: Array<Comment>;
  relative_date: string;
};

type Endpoint =
  | "/askstories.json"
  | "/topstories.json"
  | "/jobstories.json"
  | "/newstories.json"
  | "/showstories.json"
  | `/user/${string}.json`
  | `/item/${number}.json`
  | (`/${string}.json` & {});

class Api {
  #base_url = "https://hacker-news.firebaseio.com";

  #get_url(path: Endpoint) {
    return new URL(this.#formatPath(path), this.#base_url);
  }

  #formatPath(string: string) {
    const parts = string.split("/");
    if (parts.at(0) !== "v0") parts.unshift("v0");
    return "/" + parts.filter(Boolean).join("/");
  }

  async get_user(username: string) {
    const url = this.#get_url(`/user/${username}.json`);
    url.searchParams.set("print", "pretty");
    let response = await throwIfHttpError(fetch(url));

    let data = await response.json();
    const user = UserSchema.parse(data);
    return { user, posts: [] };
  }

  async get_posts(
    endpoint: Endpoint,
    hidden: Array<number> = [],
    page: number = 1,
  ): Promise<{
    stories: Feed;
    has_more: boolean;
  }> {
    const url = this.#get_url(endpoint);
    let ids = await cachedFetch(url, z.array(z.number()));

    const perPage = 30;
    let start = (page - 1) * perPage;
    const end = start + perPage;

    const critical_ids = ids
      .filter((id) => !hidden.includes(id))
      .slice(start, end);

    const critical = await Promise.all(
      critical_ids.map(async (id) => {
        let url = this.#get_url(`/item/${id}.json`);
        return cachedFetch(url, PostSchema);
      }),
    );

    return {
      has_more: ids.length > end,
      stories: critical.map((item) => {
        return {
          number: (start += 1),
          id: item.id,
          title: item.title,
          url: item.url,
          relative_date: timeago.ago(item.time * 1000),
          type: item.type,
          time: item.time,
          score: item.score,
          by: item.by,
          descendants: item.descendants,
        };
      }),
    };
  }

  async get_post(id: number): Promise<Post> {
    let url = this.#get_url(`/item/${id}.json`);
    let story = await cachedFetch(url, PostSchema);

    return {
      ...story,
      relative_date: timeago.ago(story.time * 1000),
    };
  }

  async get_comments(kids: Array<number> | undefined): Promise<Comment[]> {
    if (!kids) return [];
    const comments = await Promise.all(
      kids.map((id) => {
        return this.get_comment(id);
      }),
    );

    const childComments = await Promise.all(
      comments.map(async (comment) => {
        if (!comment.kids) return [];
        return this.get_comments(comment.kids);
      }),
    );

    return comments.map((comment, index) => {
      const kids = childComments[index] ?? [];
      return {
        ...comment,
        kids: kids.filter((kid) => {
          return kid.by != undefined || kid.text != undefined;
        }),
      };
    });
  }

  async get_comment(id: number) {
    const url = this.#get_url(`/item/${id}.json`);
    let comment = await cachedFetch(url, CommentSchema);
    return {
      ...comment,
      relative_date: timeago.ago(comment.time * 1000),
    };
  }
}

export const api = new Api();
