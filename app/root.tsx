import * as React from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "react-router";
import appStylesHref from "~/app.css?url";

export function links() {
  return [{ rel: "stylesheet", href: appStylesHref }];
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-white">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="none" />
        <Meta />
        <Links />
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
