// eslint-disable-next-line ts/ban-ts-comment
// @ts-expect-error
import tailwindcss from '@tailwindcss/vite'
import Vue from 'unplugin-vue/vite'
import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import Unplugin from 'unplugin-gueleton/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [
    tailwindcss(),
    Vue(),
    Inspect(),
    Unplugin({}),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
