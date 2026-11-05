import * as React from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useRouteError,
  useRouteLoaderData,
} from "react-router";
import appStylesHref from "~/app.css?url";
import type { Route } from "./+types/root";

export function links() {
  return [{ rel: "stylesheet", href: appStylesHref }];
}

export function loader({ request }: Route.LoaderArgs) {
  return { origin: new URL(request.url).origin };
}

export function meta(): Route.MetaDescriptors {
  return [
    { title: "Remix Hacker News" },
    { name: "description", content: "Hacker News made with Remix.run" },
  ];
}

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useRouteLoaderData("root") as
    | Route.ComponentProps["loaderData"]
    | undefined;
  const location = useLocation();
  const canonicalUrl = `${data?.origin ?? ""}${location.pathname}${location.search}`;

  return (
    <html lang="en" className="bg-white">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={canonicalUrl} />
        <Meta />
        <Links />
        <script
          src="https://cdn.usefathom.com/script.js"
          data-site="ZQQCFWCP"
          defer
        />
      </head>
      <body className="text-base text-default">
        {children}
        <Scripts />
        <ScrollRestoration />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (typeof document === "undefined") {
    console.error(error);
  }

  if (import.meta.env.PROD) {
    return (
      <div className="p-2 text-black">
        <pre>Unknown.</pre>
      </div>
    );
  }

  return (
    <div className="p-2 text-black">
      {error instanceof Error ? (
        <pre>{error.message}</pre>
      ) : (
        <pre>{JSON.stringify(error, null, 2)}</pre>
      )}
    </div>
  );
}
