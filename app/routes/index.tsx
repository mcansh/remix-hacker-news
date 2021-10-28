import { MetaFunction, LoaderFunction, Link } from "remix";
import { useLoaderData } from "remix";
import { fetcher } from "@mcansh/fetcher";

import { HackerNewsItem } from "~/types";
import { formatDate } from "~/lib/format-date";

export let meta: MetaFunction = () => {
  return {
    title: "Remix Starter",
    description: "Welcome to remix!",
  };
};

interface RouteData {
  data: HackerNewsItem[];
}

export let loader: LoaderFunction = async () => {
  let ids = await fetcher<number[]>(
    "https://hacker-news.firebaseio.com/v0/topstories.json"
  );

  let data = await Promise.all(
    ids
      .slice(0, 29)
      .map((id) =>
        fetcher<HackerNewsItem>(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json`
        )
      )
  );

  let result: RouteData = {
    data,
  };

  return result;
};

export default function Index() {
  let data = useLoaderData<RouteData>();

  return (
    <div className="max-w-4xl w-full mx-auto bg-white mt-2.5">
      <header className="bg-[#ff6600] flex items-center p-2">
        <Link to="/" className="flex items-center mr-2.5">
          <img height={20} width={20} src="/favicon.png" alt="remix logo" />
          <h1 className="font-bold ml-1">Hacker Remix</h1>
        </Link>
        <nav>
          <ul className="flex items-center">
            <li>
              <Link className="px-2.5" to="/new">
                new
              </Link>
            </li>
            <li>
              <Link className="px-2.5" to="/past">
                past
              </Link>
            </li>
            <li>
              <Link className="px-2.5" to="/comments">
                comments
              </Link>
            </li>
            <li>
              <Link className="px-2.5" to="/ask">
                ask
              </Link>
            </li>
            <li>
              <Link className="px-2.5" to="/show">
                show
              </Link>
            </li>
            <li>
              <Link className="px-2.5" to="/jobs">
                jobs
              </Link>
            </li>
            <li>
              <Link className="px-2.5" to="/submit">
                submit
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <div className="my-2.5 space-y-2.5 px-2.5 py-1">
        {data.data.map((story, index) => {
          let storyDate = new Date(story.time * 1000);
          let formatted = formatDate(storyDate);

          return (
            <div key={story.id} className="flex space-x-2.5">
              <span className="text-neutral-400 text-sm pt-0.5">
                {index + 1}.
              </span>
              <div>
                <div>
                  {story.url ? (
                    <a className="inline-block mr-2" href={story.url}>
                      {story.title}
                    </a>
                  ) : (
                    <Link
                      className="inline-block mr-2"
                      to={`/item/${story.id}`}
                    >
                      {story.title}
                    </Link>
                  )}
                  {story.url && (
                    <span className="hover:underline text-neutral-400 text-sm">
                      {new URL(story.url).hostname}
                    </span>
                  )}
                </div>
                <div className="text-neutral-400 text-sm">
                  {story.score} points by{" "}
                  <Link className="hover:underline" to={`/user/${story.by}`}>
                    {story.by}
                  </Link>{" "}
                  {formatted} |{" "}
                  <Link className="hover:underline" to={`item/${story.id}`}>
                    {story.descendants} comments
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
