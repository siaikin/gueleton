import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/*.ts',
    'src/client/vue/index.ts'
  ],
})
