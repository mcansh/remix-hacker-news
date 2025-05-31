import { createCookieSessionStorage } from "react-router/rsc";
import { unstable_createSessionMiddleware } from "./session-middleware";
import { z } from "zod/v4";

export const sessionSchema = z.object({
  hidden: z.optional(z.array(z.number())),
});

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    secrets: [process.env.SESSION_SECRET ?? "secret"],
  },
});

// const typedSessionStorage = createTypedSessionStorage({
//   sessionStorage,
//   schema: sessionSchema,
// });

export let [sessionMiddleware, getSession] =
  unstable_createSessionMiddleware(sessionStorage);
