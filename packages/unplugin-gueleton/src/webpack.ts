import type { Options } from './types'
import { createWebpackPlugin } from 'unplugin'
import { unpluginFactory } from '.'
import { createGueletonServer } from './server'

export default createWebpackPlugin<Options | undefined, false>((options, meta) => {
  const common = unpluginFactory(options, meta)

  const { startServer, prettyServerUrl } = createGueletonServer(options)
  return {
    ...common,
    async buildStart() {
      await common.buildStart?.apply(this)

      await startServer()
    },
    async buildEnd() {
      await common.buildEnd?.apply(this)

      setTimeout(() => console.log(prettyServerUrl()), 1000)
    }
  }
})
