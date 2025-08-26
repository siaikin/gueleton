import type { UnpluginFactory } from 'unplugin'
import type { Options } from './types'
import { createUnplugin } from 'unplugin'
import { createGueletonServer, REPLACE_API_PREFIX_KEY, REPLACE_PRESTORE_DATA_KEY, REPLACE_BUILD_MODE_KEY, REPLACE_SERVER_PORT_KEY } from './server'

export const unpluginFactory: UnpluginFactory<Options | undefined, false> = (options) => {
  const {
    initial,
    transformCode,
  } = createGueletonServer(options)

  return {
    name: 'unplugin-gueleton',
    enforce: 'post',
    async buildStart() {
      await initial()
    },
    transform: {
      filter: {
        id: /\.([mc])?([jt])sx?(\S*)$/,
        code: {
          include: [
            REPLACE_PRESTORE_DATA_KEY,
            REPLACE_API_PREFIX_KEY,
            REPLACE_SERVER_PORT_KEY,
            REPLACE_BUILD_MODE_KEY,
          ],
        },
      },
      handler(code) {
        return transformCode(code)
      },
    },
  }
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
