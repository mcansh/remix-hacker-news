/** @type {import("@remix-run/dev").AppConfig} */
export default {
  appDirectory: "app",
  browserBuildDirectory: "public/build",
  publicPath: "/build/",
  serverBuildDirectory: "build",
  serverModuleFormat: "esm",
  serverDependenciesToBundle: ["@remix-run/react"],
  future: {
    unstable_dev: {
      appServerPort: 3000,
      rebuildPollIntervalMs: 500,
    },
    unstable_tailwind: true,
  },
};
