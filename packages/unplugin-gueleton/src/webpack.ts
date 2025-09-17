import type { Options } from './types'
import { createWebpackPlugin } from 'unplugin'
import { unpluginFactory } from '.'
import { createGueletonServer } from './server'

const webpackPlugin = createWebpackPlugin<Options | undefined, false>((options, meta) => {
  const common = unpluginFactory(options, meta)

  const { startServer, prettyServerUrl } = createGueletonServer(options)
  return {
    ...common,
    async buildStart() {
      await common.buildStart?.apply(this)

      // eslint-disable-next-line node/prefer-global/process
      if (process.env.NODE_ENV === 'production') {
        return
      }

      await startServer()
    },
    async buildEnd() {
      await common.buildEnd?.apply(this)

      // eslint-disable-next-line node/prefer-global/process
      if (process.env.NODE_ENV === 'production') {
        return
      }

      setTimeout(() => console.log(prettyServerUrl()), 1000)
    },
  }
})

export default webpackPlugin
export { webpackPlugin as Gueleton }
