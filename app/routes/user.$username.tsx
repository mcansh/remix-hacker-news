import { format } from "date-fns";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { api } from "~/.server/api";
import { responseHelper } from "~/.server/utils";

export async function loader({ params, response }: LoaderFunctionArgs) {
  if (!params.username) throw responseHelper(response, { status: 404 });
  let { user } = await api.get_user(params.username);
  let meta = [
    { title: `${user.id} | Remix Hacker News` },
    { name: "description", content: "Hacker News made with Remix.run" },
  ];
  return { user, meta };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return data?.meta ?? [];
};

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
