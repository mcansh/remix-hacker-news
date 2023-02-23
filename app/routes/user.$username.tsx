import { fetcher } from "@mcansh/fetcher";
import sanitizeHtml from "sanitize-html";

import { HackerNewsUser } from "~/types/hackernews";
import { format } from "date-fns";
import { DataFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

interface RouteData {
  user: HackerNewsUser;
}

export async function loader({ params }: DataFunctionArgs) {
  let user = await fetcher<HackerNewsUser>(
    `https://hacker-news.firebaseio.com/v0/user/${params.username}.json?print=pretty`
  );

  let about = user.about ? sanitizeHtml(user.about) : "";

  let result: RouteData = {
    user: { ...user, about },
  };

  return result;
}

export const meta: MetaFunction = () => {
  return { title: "Remix Hacker News" };
};

export default function NewestPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <div>user: {data.user.id}</div>
      <div>created: {format(data.user.created, "MMMM dd, yyyy")}</div>
      <div>karma: {data.user.karma}</div>
      <div>
        about: <div dangerouslySetInnerHTML={{ __html: data.user.about }} />
      </div>
    </div>
  );
}
