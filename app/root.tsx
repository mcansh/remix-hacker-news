import * as React from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import faviconHref from "~/logo.png?url";

import "~/app.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-zinc-100">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href={faviconHref} type="image/png" />
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
  return (
    <div className="p-2 text-black">
      <pre>Unknown.</pre>
    </div>
  );
}
