import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import Gueleton from 'unplugin-gueleton/vite'
import ui from '@nuxt/ui/vite'
import { createHtmlPlugin } from 'vite-plugin-html'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    Gueleton(),
    ui(),
    createHtmlPlugin({
      inject: {
        data: {
          title: 'index',
          injectScript: `<script type="module" src="/src/main.ts"></script>`,
        },
      },
    }),
  ],
})
