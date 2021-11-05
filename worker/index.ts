import { createFetchHandler } from "./single-worker-remix-loader";

// @ts-ignore
import * as build from "../build";

const handleFetch = createFetchHandler({
  build,
});

export default {
  async fetch(
    request: Request,
    env: SingleWorker.Env,
    context: SingleWorker.Context
  ) {
    // TODO: Hack to stop glitchy browser caching
    request = new Request(request);
    request.headers.delete("If-None-Match");

    return handleFetch(request, env, context);
  },
};
