import type { EventHandlerRequest, H3Event } from 'h3'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Options } from './types'
import { addComponent, addDevServerHandler, addPluginTemplate, addTypeTemplate, addVitePlugin, addWebpackPlugin, createResolver, defineNuxtModule, extendViteConfig, useLogger } from '@nuxt/kit'
import { defu } from 'defu'
import { defineEventHandler } from 'h3'
import { createVitePlugin, createWebpackPlugin } from 'unplugin'
import { unpluginFactory } from '.'
import { createGueletonServer } from './server'

export interface ModuleOptions extends Options {

}

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
    const {
      prestoreRootDir,
      prettyServerUrl,
      setupHandlers,
      setupPort,
    } = createGueletonServer(options)

    const logger = useLogger('nuxt-gueleton')

    addVitePlugin(() => createVitePlugin(unpluginFactory)(options))
    addWebpackPlugin(() => createWebpackPlugin(unpluginFactory)(options))

    /**
     * nuxt 提供的 `watchers.chokidar` 不能正常生效. 使用[临时方案](https://github.com/nuxt/nuxt/issues/30459#issuecomment-2594081828)
     *
     * todo 等待 https://github.com/nuxt/nuxt/issues/30756 解决
     */
    extendViteConfig((config) => {
      /**
       * nuxt build 时添加 watch 属性会导致下列报错. 在 production 环境下不添加 watch 属性
       * ```
       * Nuxt Build Error: ENOENT: no such file or directory, open 'xxx/node_modules/.cache/nuxt/.nuxt/dist/client/manifest.json'
       * ```
       */
      // eslint-disable-next-line node/prefer-global/process
      if (process.env.NODE_ENV === 'production') {
        return
      }

      config.build = defu(config.build, {
        watch: {
          chokidar: {
            ignored: [
              `${prestoreRootDir}/**`,
            ],
          },
          exclude: [`${prestoreRootDir}/**`],
        },
      })
    })

    setupHandlers((handlers) => {
      for (const { route, handler } of handlers) {
        addDevServerHandler({
          route,
          handler: defineEventHandler(handlerAdapter(handler)),
        })
      }
    })

    _nuxt.hooks.hook('vite:serverCreated', (_, { isServer }) => {
      if (!isServer) {
        return
      }

      setupPort(_nuxt.options.devServer.port)
      logger.info(prettyServerUrl(!!_nuxt.options.devServer.https, _nuxt.options.devServer.port))
    })

    const resolver = createResolver(import.meta.url)
    /**
     * 自动注册组件
     */
    {
      const names = [
        'Gueleton',
      ]
      names.forEach(name => addComponent({ name, export: name, filePath: resolver.resolve('./client/vue') }))
    }

    addPluginTemplate({
      filename: 'gueleton-provider.plugin.js',
      getContents: () => `
import { defineNuxtPlugin } from '#app/nuxt'
import { GueletonProvider } from 'unplugin-gueleton/client/core'
import { GueletonInjectionKey } from 'unplugin-gueleton/client/vue'

export default defineNuxtPlugin({
  name: 'gueleton-provider-plugin',
  setup (nuxtApp) {
    const appConfig = useAppConfig()
    GueletonProvider.updateOptions(appConfig.gueleton)

    nuxtApp.vueApp.provide(GueletonInjectionKey, { provider: GueletonProvider })
  }
})`,
    })

    addTypeTemplate({
      filename: 'types/gueleton.d.ts',
      getContents: () => `
import type { PartialDeep } from 'type-fest'
import type { GueletonProviderOptions } from 'unplugin-gueleton/client/core'

declare module 'nuxt/schema' {
  interface AppConfigInput {
    gueleton?: PartialDeep<GueletonProviderOptions>
  }

  interface AppConfig {
    gueleton: GueletonProviderOptions
  }
}
`,
    })
  },
})
