import { format } from "date-fns";
import { unstable_defineLoader } from "@remix-run/cloudflare";
import type { MetaArgs_SingleFetch } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { api } from "~/.server/api";
import { cacheHeader } from "pretty-cache-header";

export const loader = unstable_defineLoader(async ({ params, response }) => {
  if (!params.username) {
    response.status = 404;
    throw response;
  }

  const { user } = await api.get_user(params.username);
  const meta = [
    { title: `${user.id} | Remix Hacker News` },
    { name: "description", content: "Hacker News made with Remix.run" },
  ];

  response.headers.append(
    "Cache-Control",
    cacheHeader({
      public: true,
      maxAge: "0m",
      mustRevalidate: true,
    }),
  );
  response.headers.append(
    "cdn-cache-control",
    cacheHeader({
      public: true,
      sMaxage: "60s",
      staleWhileRevalidate: "1w",
    }),
  );

  return { user, meta };
});

export function meta({ data }: MetaArgs_SingleFetch<typeof loader>) {
  return data?.meta ?? [];
}

export default function NewestPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <div>user: {data.user.id}</div>
      <div>created: {format(data.user.created * 1000, "MMMM dd, yyyy")}</div>
      <div>karma: {data.user.karma}</div>
      <div>
        about: <div dangerouslySetInnerHTML={{ __html: data.user.about }} />
      </div>
    </div>
  );
}
