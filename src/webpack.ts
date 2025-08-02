import type { Options } from './types'
import process from 'node:process'
import { isNil } from 'lodash-es'
import { createWebpackPlugin } from 'unplugin'
import { unpluginFactory } from '.'
import { createGueletonServer } from './server'

export default createWebpackPlugin<Options, false>((options, meta) => {
  const common = unpluginFactory(options, meta)

  const {
    updateApiPrefix,
    handler,
    prettyUrl,
  } = createGueletonServer(process.cwd())

  return {
    ...common,
    webpack(compiler) {
      const options = compiler.options
      if (isNil(options.devServer) || options.devServer === false) {
        return
      }

      const apiPrefix = updateApiPrefix('')

      options.devServer = {
        setupMiddlewares: (middlewares: any) => {
          middlewares.push(
            {
              name: 'gueleton-all',
              path: `${apiPrefix}/storage/all`,
              middleware: handler.allPrestoreDataHandler,
            },
            {
              name: 'gueleton',
              path: `${apiPrefix}/storage`,
              middleware: handler.prestoreDataHandler,
            },
            {
              name: 'gueleton-panel',
              path: `${apiPrefix}`,
              middleware: handler.panelPageHandler,
            },
          )

          return middlewares
        },
      }
    },
  }
})
