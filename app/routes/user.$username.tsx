import { format } from "date-fns";
import { DataFunctionArgs, json, MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { api } from "~/lib/api";

export async function loader({ params }: DataFunctionArgs) {
  if (!params.username) {
    throw new Response("Not Found", { status: 404 });
  }

  let user = await api.get_user(params.username);
  return json({ user });
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
