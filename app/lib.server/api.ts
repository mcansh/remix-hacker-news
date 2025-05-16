import { throwIfHttpError } from "fetch-extras";
import * as timeago from "time-ago";
import { z } from "zod/v4";

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
    let response = await throwIfHttpError(fetch(url));
    let data = await response.json();
    const ids = z.array(z.number()).parse(data);

    const perPage = 30;
    let start = (page - 1) * perPage;
    const end = start + perPage;

    const critical_ids = ids
      .filter((id) => !hidden.includes(id))
      .slice(start, end);

    const critical = await Promise.all(
      critical_ids.map(async (id) => {
        let url = this.#get_url(`/item/${id}.json`);
        let response = await throwIfHttpError(fetch(url));
        let data = await response.json();
        return PostSchema.parse(data);
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
    let response = await throwIfHttpError(fetch(url));
    let data = await response.json();
    const story = PostSchema.parse(data);

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
    let response = await throwIfHttpError(fetch(url));
    let data = await response.json();
    const item = CommentSchema.parse(data);
    return {
      ...item,
      relative_date: timeago.ago(item.time * 1000),
    };
  }
}

export const api = new Api();
