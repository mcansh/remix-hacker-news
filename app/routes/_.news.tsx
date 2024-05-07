import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { redirectHelper } from "~/.server/utils";

export function loader({ response }: LoaderFunctionArgs) {
  throw redirectHelper(response, "/");
}
