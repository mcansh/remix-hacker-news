import { unstable_defineLoader } from "@remix-run/cloudflare";
import { redirectHelper } from "~/.server/utils";

export const loader = unstable_defineLoader(async ({ response }) => {
  throw redirectHelper(response, "/");
});
