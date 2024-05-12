import { unstable_defineLoader } from "@remix-run/cloudflare";

export const loader = unstable_defineLoader(async () => {
  throw new Response(null, { status: 302, headers: { Location: "/" } });
});
