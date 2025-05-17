import type { SessionData } from "react-router";
import type { SessionStorage } from "react-router";
import { createCookieSessionStorage, createRequestHandler } from "react-router";
import { createTypedSessionStorage } from 'remix-utils/typed-session'
import { z } from "zod";

declare module "react-router" {
  export interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
    sessionStorage: ReturnType<typeof createTypedSessionStorage<typeof sessionSchema>>
  }
}

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

const sessionSchema = z.object({
	hidden: z.optional(z.array(z.number()))
})

export default {
  async fetch(request, env, ctx) {
    const sessionStorage = createCookieSessionStorage({
      cookie: {
        name: "__session",
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secure: import.meta.env.PROD,
        secrets: [env.SESSION_SECRET],
      },
    });

    const typedSessionStorage = createTypedSessionStorage({sessionStorage, schema: sessionSchema})

    return requestHandler(request, {
      cloudflare: { env, ctx },
      sessionStorage: typedSessionStorage,
    });
  },
} satisfies ExportedHandler<Env>;
