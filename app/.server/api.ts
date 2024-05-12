import * as timeago from "time-ago";
import { z } from "zod";
import { createZodFetcher } from "zod-fetch";
import sanitizeHtml from "sanitize-html";

const zetch = createZodFetcher();

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
  type: z.string(),
});

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
  | `/item/${number}.json`;

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

  get_user = async (username: string) => {
    const url = this.#get_url(`/user/${username}.json`);
    url.searchParams.set("print", "pretty");
    const user = await zetch(UserSchema, url);
    const about = user.about ? sanitizeHtml(user.about) : "";
    return { user: { ...user, about }, posts: [] };
  };

  get_posts = async (endpoint: Endpoint) => {
    const url = this.#get_url(endpoint);
    const ids = await zetch(z.array(z.number()), url);

    const critical_ids = ids.slice(0, 29);

    const data = await Promise.all(
      critical_ids.map((id) => {
        return zetch(PostSchema, this.#get_url(`/item/${id}.json`));
      }),
    );

    return data.map((item) => {
      return {
        id: item.id,
        title: item.title,
        url: item.url,
        relative_date: timeago.ago(item.time * 1000),
        score: item.score,
        by: item.by,
        descendants: item.descendants,
      };
    });
  };

  get_post = async (id: number) => {
    const story = await zetch(PostSchema, this.#get_url(`/item/${id}.json`));

    return {
      ...story,
      text: story.text ? sanitizeHtml(story.text) : undefined,
      relative_date: timeago.ago(story.time * 1000),
    };
  };

  get_comments = async (
    kids: Array<number> | undefined,
  ): Promise<Comment[]> => {
    if (!kids) return [];
    const commentsToFetch = kids.slice(0, 4);
    const comments = await Promise.all(commentsToFetch.map(this.get_comment));

    const childComments = await Promise.all(
      comments.map(async (comment) => {
        if (comment.kids) {
          return this.get_comments(comment.kids);
        }
      }),
    );

    return comments.map((comment, index) => {
      let kids = childComments[index] || [];
      return {
        ...comment,
        kids: this.#filter_sus_comments(kids),
      };
    });
  };

  get_comment = async (id: number) => {
    let url = this.#get_url(`/item/${id}.json`);
    console.log({ url: url.href });

    const item = await zetch(CommentSchema, url);

    return {
      ...item,
      text: item.text ? sanitizeHtml(item.text) : undefined,
      relative_date: timeago.ago(item.time * 1000),
    };
  };

  #filter_sus_comments = (comments: Array<Comment>) => {
    return comments.filter((comment) => {
      return comment.by != undefined || comment.text != undefined;
    });
  };
}

export const api = new Api();
