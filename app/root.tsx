import { provide } from "@ryanflorence/async-provider";
import { Outlet } from "react-router";
import { unstable_MiddlewareFunction } from "react-router/rsc";
import "./app.css";
import { stringContext } from "./context";
import { ErrorReporter, GlobalNavigationLoadingBar } from "./root.client";
import { sessionMiddleware} from './lib.server/middleware'

export const unstable_middleware: unstable_MiddlewareFunction<Response>[] = [
	sessionMiddleware,
  async ({ request }, next) => {
    console.log(">>> RSC middleware", request.url);
    let res = await provide(new Map([[stringContext, "Hello World!!!"]]), next);
    res.headers.set("X-Custom-Header", "Value");
    console.log("<<< RSC middleware", request.url);
    return res;
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  console.log("Rendering Layout");

  return (
    <html lang="en" className="bg-white">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <Meta /> */}
        {/* <Links /> */}
      </head>
      <body className="text-base text-default">
        <GlobalNavigationLoadingBar />
        {children}
        {/* <Scripts /> */}
        {/* <ScrollRestoration /> */}
      </body>
    </html>
  );
}

export function ServerComponent() {
  return (
    <div id="root">
      <Outlet />
    </div>
  );
}

export function ErrorBoundary() {
  return <ErrorReporter />;
}
