// eslint-disable-next-line ts/ban-ts-comment
// @ts-expect-error
import tailwindcss from '@tailwindcss/vite'
// eslint-disable-next-line ts/ban-ts-comment
// @ts-expect-error
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import Unplugin from '../src/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    vue(),
    Inspect(),
    Unplugin(),
  ],
})
