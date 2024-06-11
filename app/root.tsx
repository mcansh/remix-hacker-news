import * as React from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";

import "~/app.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-zinc-100">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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

  if (process.env.NODE_ENV === "production") {
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
