import type { Config } from "@react-router/dev/config";

export default {
  // This is the ONLY configuration option that Parcel currently supports.
  // ALL other options are ignored.
  appDirectory: "app",
  ssr: true,
  future: {
    unstable_viteEnvironmentApi: true,
    unstable_middleware: true,
    unstable_optimizeDeps: true,
    unstable_splitRouteModules: true,
    unstable_subResourceIntegrity: true,
  },
} satisfies Config;
