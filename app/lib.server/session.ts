import { createCookieSessionStorage } from "react-router";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: import.meta.env.NODE_ENV === "production",
    secrets: [import.meta.env.SESSION_SECRET],
  },
});
