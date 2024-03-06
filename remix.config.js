// /** @type {import('@remix-run/dev').AppConfig} */
// export default {
//   ignoredRouteFiles: ["**/.*"],
//   // appDirectory: "app",
//   // assetsBuildDirectory: "public/build",
//   // publicPath: "/build/",
//   // serverBuildPath: "build/index.js",
// };
/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*,", "**/*.css"],
  serverModuleFormat: "cjs",
  publicPath: "/rapportering/build/",
};

