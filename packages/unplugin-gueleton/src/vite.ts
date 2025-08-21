import type { Options } from './types'
import { isArray } from 'lodash-es'
import { createVitePlugin } from 'unplugin'
import { unpluginFactory } from '.'
import { createGueletonServer } from './server'

export default createVitePlugin<Options | undefined, false>((options, meta) => {
  const common = unpluginFactory(options, meta)

  const {
    prestoreRootDir,
    setupHandlers,
    prettyServerUrl,
  } = createGueletonServer(options)

  return {
    ...common,
    vite: {
      configureServer(server) {
        if (isArray(server.watcher.options.ignored)) {
          server.watcher.options.ignored.push(prestoreRootDir)
        }
        else if (server.watcher.options.ignored) {
          server.watcher.options.ignored = [server.watcher.options.ignored, prestoreRootDir]
        }

        const config = server.config

        setupHandlers(config.server.port, (handlers) => {
          for (const { route, handler } of handlers) {
            server.middlewares.use(route, handler)
          }
        })

        config.logger.info(prettyServerUrl(config.server.https as unknown as boolean, config.server.port))
      },
    },
  }
})
