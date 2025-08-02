import { defineConfig } from 'tsdown'

export default defineConfig({
  target: 'es2015',
  entry: [
    'src/*.ts',
    'src/client/vue/index.ts',
  ],
  shims: true,
  dts: {
    sourcemap: true,
  },
  exports: {
    customExports: (exports) => {
      exports['./client/vue'] = exports['./client/vue/index']
      delete exports['./client/vue/index']

      return exports
    },
  },
  copy: [
    { from: 'src/server/assets', to: 'dist/server/assets' },
  ],
  unbundle: true,
})
