import type { Options } from './types'
import process from 'node:process'
import { addComponent, addDevServerHandler, addVitePlugin, addWebpackPlugin, defineNuxtModule, useLogger } from '@nuxt/kit'
import { createVitePlugin, createWebpackPlugin } from 'unplugin'
import { unpluginFactory } from '.'
import { createGueletonServer } from './server'

export interface ModuleOptions extends Options {

}

const {
  updateApiPrefix,
  handler,
  prestoreRootDir,
  prettyUrl,
} = createGueletonServer(process.cwd())

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

    const apiPrefix = updateApiPrefix(_nuxt.options.app.baseURL || '/')

    addDevServerHandler({
      route: `${apiPrefix}/storage/all`,
      handler: handler.allPrestoreDataHandler,
    })
    addDevServerHandler({
      route: `${apiPrefix}/storage`,
      handler: handler.prestoreDataHandler,
    })
    addDevServerHandler({
      route: `${apiPrefix}`,
      handler: handler.allPrestoreDataHandler,
    })

    logger.info(prettyUrl(!!_nuxt.options.devServer.https, _nuxt.options.devServer.port))

    {
      const names = [
        'Gueleton',
        'GueletonProvider',
      ]
      names.forEach(name => addComponent({ name, export: name, filePath: 'unplugin-gueleton/client/vue' }))
    }
  },
})
