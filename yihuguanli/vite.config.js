import { fileURLToPath, URL } from "node:url";

import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import { defineConfig } from "vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const isGhPagesBuild = process.env.GITHUB_ACTIONS === "true" && !!repoName;
// https://vite.dev/config/
export default defineConfig({
  base: isGhPagesBuild ? `/${repoName}/` : "/",
  plugins: [
    vue(),
    vueDevTools(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
