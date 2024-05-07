import * as React from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
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
        <div className="mx-auto w-full bg-bg sm:mt-2.5 md:w-[85%] md:min-w-[796px]">
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

export function ErrorBoundary() {
  let error = useRouteError();

  return (
    <div className="p-2">
      {isRouteErrorResponse(error) ? (
        <h1>
          {error.status} | {error.statusText}
        </h1>
      ) : error instanceof Error ? (
        <>
          <h1 className="text-base font-semibold">Application Error</h1>
          <p className="pt-4">{error.message}</p>
          {process.env.NODE_ENV === "development" ? (
            <pre className="font-mono overflow-auto pt-4 text-comment">
              {error.stack}
            </pre>
          ) : null}
        </>
      ) : (
        <h1>Unknown error</h1>
      )}
    </div>
  );
}
