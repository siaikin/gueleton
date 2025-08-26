import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import tailwindcss from '@tailwindcss/vite'
import Gueleton from 'unplugin-gueleton/vite'

export default defineConfig({
  plugins: [solid(), tailwindcss(), Gueleton()],
})
