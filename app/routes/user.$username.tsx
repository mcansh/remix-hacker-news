import { format } from "date-fns";
import { api } from "~/lib.server/api";
import type { Route } from "./+types/user.$username";

export async function loader({ params }: Route.LoaderArgs) {
  const { user } = await api.get_user(params.username);
  const meta = [
    { title: `${user.id} | Remix Hacker News` },
    { name: "description", content: "Hacker News made with Remix.run" },
  ];

  return { user, meta };
}

export function meta({ data }: Route.MetaArgs) {
  return data?.meta ?? [];
}

export default function NewestPage({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <div>user: {loaderData.user.id}</div>
      <div>
        created: {format(loaderData.user.created * 1000, "MMMM dd, yyyy")}
      </div>
      <div>karma: {loaderData.user.karma}</div>
      <div>
        <p>about:</p>
        {loaderData.user.about ? (
          <div dangerouslySetInnerHTML={{ __html: loaderData.user.about }} />
        ) : null}
      </div>
    </div>
  );
}
