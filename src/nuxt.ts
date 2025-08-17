import type { EventHandlerRequest, H3Event } from 'h3'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Options } from './types'
import process from 'node:process'
import { addComponent, addDevServerHandler, addVitePlugin, addWebpackPlugin, defineNuxtModule, useLogger } from '@nuxt/kit'
import { defu } from 'defu'
import { defineEventHandler } from 'h3'
import { createVitePlugin, createWebpackPlugin } from 'unplugin'
import { unpluginFactory } from '.'
import { createGueletonServer } from './server'

export interface ModuleOptions extends Options {

}

const {
  updateApiPrefix,
  getHandlers,
  prettyUrl,
  prestoreRootDir,
} = createGueletonServer(process.cwd())

function handlerAdapter<
  Request extends EventHandlerRequest = EventHandlerRequest,
// Response = EventHandlerResponse
>(
  handler: (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => Promise<void>,
) {
  return (event: H3Event<Request>) => handler(event.node.req, event.node.res)
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-gueleton',
    configKey: 'gueleton',
  },
  defaults: {
    // ...default options
  },
  setup(options, _nuxt) {
    const logger = useLogger('nuxt-gueleton')

    addVitePlugin(() => createVitePlugin(unpluginFactory)(options))
    addWebpackPlugin(() => createWebpackPlugin(unpluginFactory)(options))

    /**
     * nuxt 提供的 `watchers.chokidar` 不能正常生效. 使用[临时方案](https://github.com/nuxt/nuxt/issues/30459#issuecomment-2594081828)
     *
     * todo 等待 https://github.com/nuxt/nuxt/issues/30756 解决
     */
    _nuxt.options = defu(_nuxt.options, {
      vite: {
        build: {
          watch: {
            chokidar: {
              ignored: [
                `${prestoreRootDir}/**`,
              ],
            },
            exclude: [`${prestoreRootDir}/**`],
          },
        },
        server: {
          watch: {
            ignored: [
              `${prestoreRootDir}/**`,
            ],
          },
        },
      },
      watchers: {
        chokidar: {
          ignored: [
            `${prestoreRootDir}/**`,
          ],
        },
      },
    })

    updateApiPrefix(_nuxt.options.app.baseURL || '/')

    for (const { route, handler } of getHandlers()) {
      addDevServerHandler({
        route,
        handler: defineEventHandler(handlerAdapter(handler)),
      })
    }

    _nuxt.hooks.hook('vite:serverCreated', () => {
      logger.info(prettyUrl(!!_nuxt.options.devServer.https, _nuxt.options.devServer.port))
    })

    /**
     * 自动注册组件
     */
    {
      const names = [
        'Gueleton',
        'GueletonProvider',
      ]
      names.forEach(name => addComponent({ name, export: name, filePath: 'unplugin-gueleton/client/vue' }))
    }
  },
})
