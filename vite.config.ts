import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { cjsInterop } from "vite-plugin-cjs-interop";
import { devErrorBoundary } from "@metronome-sh/dev-error-boundary";
import { getLoadContext } from "./load-context";

export default defineConfig({
  plugins: [
    remixCloudflareDevProxy({ getLoadContext }),
    remix({
      future: {
        unstable_singleFetch: true,
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    tsconfigPaths(),
    cjsInterop({ dependencies: ["time-ago"] }),
    devErrorBoundary(),
  ],
});
