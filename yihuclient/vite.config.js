import { fileURLToPath, URL } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from '@vant/auto-import-resolver';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const isGhPagesBuild = process.env.GITHUB_ACTIONS === 'true' && !!repoName
const configuredBase = process.env.VITE_PUBLIC_BASE

// https://vite.dev/config/
export default defineConfig({
  base: configuredBase || (isGhPagesBuild ? `/${repoName}/` : '/'),
  plugins: [
    vue(),
    vueDevTools(), 
    AutoImport({
      resolvers: [VantResolver()],
    }),
    Components({
      resolvers: [VantResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
