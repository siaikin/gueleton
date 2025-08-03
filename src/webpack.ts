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
    getHandlers,
    prettyUrl,
  } = createGueletonServer(process.cwd())

  return {
    ...common,
    webpack(compiler) {
      const logger = compiler.getInfrastructureLogger(common.name)

      const options = compiler.options
      if (isNil(options.devServer) || options.devServer === false) {
        return
      }

      updateApiPrefix('')

      options.devServer = {
        setupMiddlewares: (middlewares: any, devServer: any) => {
          if (!devServer) {
            throw new Error('webpack-dev-server is not defined')
          }

          for (const { route, handler } of getHandlers()) {
            middlewares.push({
              name: route,
              path: route,
              middleware: handler,
            })
          }

          return middlewares
        },
      }

      logger.info(prettyUrl(
        options.devServer.server === 'https' || options.devServer.server?.type === 'https',
        options.devServer.port || '80',
      ))
    },
  }
})
