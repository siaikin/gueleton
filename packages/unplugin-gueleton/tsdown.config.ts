import { defineConfig } from 'tsdown'
import Vue from 'unplugin-vue/rolldown'

export default defineConfig({
  entry: [
    'src/*.ts',
    'src/client/vue/index.ts',
    'src/client/core/index.ts',
  ],
  format: ['esm', 'cjs'],
  plugins: [Vue({ isProduction: true })],
  shims: true,
  dts: {
    sourcemap: true,
    vue: true,
  },
  outputOptions: {
    /**
     * 同时具有命名导出和默认导出需要设置为 'named'。
     * @see https://rollupjs.org/configuration-options/#output-exports
     */
    exports: 'named',
  },
  exports: {
    customExports: (exports) => {
      exports['./client/vue'] = exports['./client/vue/index']
      delete exports['./client/vue/index']

      exports['./client/core'] = exports['./client/core/index']
      delete exports['./client/core/index']

      return exports
    },
  },
  copy: [
    { from: 'src/server/assets', to: 'dist/server/assets' },
  ],
  unbundle: true,
})
