import { redirect } from "react-router";
import type { Route } from "./+types/news";

export function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (id) throw redirect(`/item/${id}`);
  throw redirect("/");
}
