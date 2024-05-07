import { LoaderFunctionArgs } from "@remix-run/cloudflare";

export function loader({ response }: LoaderFunctionArgs) {
  if (!response) throw new Error("No response object");
  response.status = 302;
  response.headers.set("Location", "/");
  return response;
}
