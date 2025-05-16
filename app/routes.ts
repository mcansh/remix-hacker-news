import type { RouteConfig } from "@react-router/dev/routes";
import { index, layout, route } from "@react-router/dev/routes";

export default [
  layout("routes/layout.tsx", [
    index("routes/home.tsx"),
    route("ask", "routes/ask.tsx"),
    route("item/:id", "routes/item.$id.tsx"),
    route("jobs", "routes/jobs.tsx"),
    route("newest", "routes/newest.tsx"),
    route("news", "routes/news.tsx"),
    route("show", "routes/show.tsx"),
    route("user/:username", "routes/user.$username.tsx"),
  ]),
] satisfies RouteConfig;
