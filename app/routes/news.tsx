import { redirect } from "react-router";
import type { Route } from "./+types/news";

export function loader({ request }: Route.LoaderProps) {
  let url = new URL(request.url);
  let id = url.searchParams.get("id");
  if (id) throw redirect(`/item/${id}`);
  throw redirect("/");
}
