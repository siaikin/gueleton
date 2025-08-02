import type { UnpluginFactory } from 'unplugin'
import type { Options } from './types'
import process from 'node:process'
import { createUnplugin } from 'unplugin'
import { createGueletonServer, REPLACE_API_PREFIX_KEY, REPLACE_PRESTORE_DATA_KEY } from './server'

const {
  initial,
  transformCode,
} = createGueletonServer(process.cwd())

// eslint-disable-next-line unused-imports/no-unused-vars
export const unpluginFactory: UnpluginFactory<Options | undefined, false> = (options) => {
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
          include: [REPLACE_PRESTORE_DATA_KEY, REPLACE_API_PREFIX_KEY],
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
