import { createCookieSessionStorage } from "@remix-run/cloudflare";
import { createTypedSessionStorage } from "remix-utils/typed-session";
import { z } from "zod";

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    secure: process.env.NODE_ENV === "production",
  },
});

const schema = z.object({
  hidden: z.array(z.number()).optional(),
});

const typedSessionStorage = createTypedSessionStorage({ sessionStorage, schema });

export { typedSessionStorage as sessionStorage };
