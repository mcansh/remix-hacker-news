import type { AppLoadContext } from "@remix-run/cloudflare";
import { createCookieSessionStorage } from "@remix-run/cloudflare";
import {
  type TypedSessionStorage,
  createTypedSessionStorage,
} from "remix-utils/typed-session";
import type { PlatformProxy } from "wrangler";
import { z } from "zod";

// When using `wrangler.toml` to configure bindings,
// `wrangler types` will generate types for those bindings
// into the global `Env` interface.
// Need this empty interface so that typechecking passes
// even if no `wrangler.toml` exists.
// biome-ignore lint/complexity/noBannedTypes: this is fine...
type Env = {};

type Cloudflare = Omit<PlatformProxy<Env>, "dispose">;

const sessionSchema = z.object({
  hidden: z.array(z.number()).optional(),
});

declare module "@remix-run/cloudflare" {
  interface AppLoadContext {
    cloudflare: Cloudflare;
    sessionStorage: TypedSessionStorage<typeof sessionSchema>;
  }
}

type GetLoadContext = (args: {
  request: Request;
  context: { cloudflare: Cloudflare }; // load context _before_ augmentiation
}) => AppLoadContext;

// shared implementation compatible with Vite, Wrangler, and Cloudflare Pages
export const getLoadContext: GetLoadContext = ({ context }) => {
  const envSchema = z.object({
    SESSION_SECRET: z.string(),
  });

  const env = envSchema.parse(context.cloudflare.env);

  const sessionStorage = createCookieSessionStorage({
    cookie: {
      name: "__session",
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      secure: process.env.NODE_ENV === "production",
      secrets: [env.SESSION_SECRET],
    },
  });

  const typedSessionStorage = createTypedSessionStorage({
    sessionStorage,
    schema: sessionSchema,
  });

  return {
    ...context,
    sessionStorage: typedSessionStorage,
  };
};
