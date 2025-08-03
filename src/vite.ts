import type { Options } from './types'
import process from 'node:process'
import { isArray } from 'lodash-es'
import { createVitePlugin } from 'unplugin'
import { unpluginFactory } from '.'
import { createGueletonServer } from './server'

export default createVitePlugin<Options, false>((options, meta) => {
  const common = unpluginFactory(options, meta)

  const {
    updateApiPrefix,
    getHandlers,
    prestoreRootDir,
    prettyUrl,
  } = createGueletonServer(process.cwd())

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

        updateApiPrefix(server.config.base || '/')

        for (const { route, handler } of getHandlers()) {
          server.middlewares.use(route, handler)
        }

        const config = server.config
        config.logger.info(prettyUrl(config.server.https as unknown as boolean, config.server.port || '80'))
      },
    },
  }
})
