import * as React from "react";
import { LinksFunction } from "@remix-run/cloudflare";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import tailwindUrl from "tailwindcss/tailwind.css";
import { Header } from "./components/header";

export let links: LinksFunction = () => {
  return [
    { rel: "preload", href: tailwindUrl, as: "style" },
    { rel: "stylesheet", href: tailwindUrl },
  ];
};

interface DocumentProps {
  title?: string;
  children: React.ReactNode;
}

const Document: React.FC<DocumentProps> = ({ children, title }) => {
  return (
    <html lang="en" className="bg-zinc-100">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        {title ? <title>{title}</title> : null}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="max-w-6xl w-full mx-auto bg-white sm:mt-2.5">
          <Header />
          {children}
        </div>
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
        <ScrollRestoration />
      </body>
    </html>
  );
};

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}
