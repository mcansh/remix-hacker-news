import * as React from "react";
import { LinksFunction } from "@remix-run/cloudflare";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import faviconHref from "~/logo.png?url";

import "~/app.css";
import { Header } from "./components/header";

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
        <div className="md:w-[85%] md:min-w-[796px] w-full mx-auto bg-bg sm:mt-2.5">
          <Header />
          {children}
        </div>
        <Scripts />
        <ScrollRestoration />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
