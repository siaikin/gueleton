import type { Options } from './types'
import { isNil } from 'lodash-es'
import { createVitePlugin } from 'unplugin'
import { unpluginFactory } from '.'
import { createGueletonServer } from './server'

export default createVitePlugin<Options | undefined, false>((options, meta) => {
  const common = unpluginFactory(options, meta)

  const {
    prestoreRootDir,
    setupHandlers,
    setupPort,
    prettyServerUrl,
  } = createGueletonServer(options)

  return {
    ...common,
    vite: {
      config() {
        return {
          server: {
            watch: {
              ignored: [prestoreRootDir],
            },
          },
        }
      },
      async configureServer(server) {
        if (isNil(server.httpServer)) {
          server.config.logger.error('Vite dev server httpServer is not available.')
          return
        }

        setupHandlers(handlers => handlers.forEach(({ route, handler }) => server.middlewares.use(route, handler)))

        server.httpServer?.on('listening', async () => {
          await server.waitForRequestsIdle()

          const config = server.config

          setupPort(config.server.port)

          config.logger.info(`  ${prettyServerUrl(config.server.https as unknown as boolean, config.server.port)}`)
        })
      },
    },
  }
})
