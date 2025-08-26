import { defineConfig } from 'tsdown'
import Vue from 'unplugin-vue/rolldown'

export default defineConfig({
  entry: [
    'src/*.ts',
    'src/client/core/index.ts',
    'src/client/vue/index.ts',
    'src/client/react/index.ts',
    // 'src/client/solid-js/index.ts',
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
      [
        { from: './client/core/index', to: './client/core' },
        { from: './client/vue/index', to: './client/vue' },
        { from: './client/react/index', to: './client/react' },
        { from: './client/solid-js/index', to: './client/solid-js' },
      ]
        .forEach(({ from, to }) => {
          if (!exports[from])
            return

          exports[to] = exports[from]
          delete exports[from]
        })

      return exports
    },
  },
  copy: [
    { from: 'src/server/assets', to: 'dist/server/assets' },
  ],
  unbundle: true,
})
