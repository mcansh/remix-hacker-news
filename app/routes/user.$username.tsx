import {
  RouteComponent,
  LoaderFunction,
  MetaFunction,
  useLoaderData,
} from "remix";
import { fetcher } from "@mcansh/fetcher";
import sanitizeHtml from "sanitize-html";

import { HackerNewsUser } from "~/types/hackernews";
import { format } from "date-fns";

interface RouteData {
  user: HackerNewsUser;
}

const loader: LoaderFunction = async ({ params }) => {
  let user = await fetcher<HackerNewsUser>(
    `https://hacker-news.firebaseio.com/v0/user/${params.username}.json?print=pretty`
  );

  let about = user.about ? sanitizeHtml(user.about) : "";

  let result: RouteData = {
    user: {
      ...user,
      about,
    },
  };

  return result;
};

const meta: MetaFunction = () => ({
  title: "Remix Hacker News",
});

const NewestPage: RouteComponent = () => {
  const data = useLoaderData<RouteData>();

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
};

export default NewestPage;
export { loader, meta };
