import type { IncomingMessage, ServerResponse } from 'node:http'
import type { UnpluginFactory } from 'unplugin'
import type { Options } from './types'
import { Buffer } from 'node:buffer'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import process from 'node:process'
import { isArray, isNil, trimEnd } from 'lodash-es'
import { createUnplugin } from 'unplugin'

const {
  prestoreRoot,
  prestoreData,
  handler,
} = gueletonServerPlugin()

// eslint-disable-next-line unused-imports/no-unused-vars
export const unpluginFactory: UnpluginFactory<Options | undefined> = options => ({
  name: 'unplugin-gueleton',
  transform: {
    filter: {
      id: /\.(m|c)?(j|t)sx?$/,
      code: {
        include: '__GUELETON_PRESTORE_DATA__',
      },
    },
    handler(code) {
      return code.replace('__GUELETON_PRESTORE_DATA__', JSON.stringify(prestoreData))
    },
  },
  vite: {
    configureServer(server) {
      if (isArray(server.watcher.options.ignored)) {
        server.watcher.options.ignored.push(prestoreRoot)
      }
      else if (server.watcher.options.ignored) {
        server.watcher.options.ignored = [server.watcher.options.ignored, prestoreRoot]
      }

      server.middlewares.use('/gueleton-api/storage', handler)
    },
  },
  webpack(compiler) {
    const options = compiler.options
    if (isNil(options.devServer) || options.devServer === false) {
      return
    }

    options.devServer = {
      setupMiddlewares: (middlewares: any) => {
        middlewares.push({
          name: 'gueleton',
          path: '/gueleton-api/storage',
          middleware: handler,
        })

        return middlewares
      },
    }
  },
})

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin

function gueletonServerPlugin(): {
  prestoreRoot: string
  prestoreIndexJsonPath: string
  prestoreData: Record<string, string>
  handler: (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => Promise<void>
} {
  const prestoreRoot: string = `${trimEnd(process.cwd(), '/')}/.gueleton`
  mkdirSync(prestoreRoot, { recursive: true })

  const prestoreIndexJsonPath: string = `${prestoreRoot}/index.json`
  if (!existsSync(prestoreIndexJsonPath)) {
    writeFileSync(prestoreIndexJsonPath, '{}', { encoding: 'utf-8' })
  }

  const prestoreData: Record<string, string> = (() => {
    try {
      return JSON.parse(readFileSync(prestoreIndexJsonPath, { encoding: 'utf-8' }) || '{}')
    }
    catch (e) {
      console.error(e)
      return {}
    }
  })()

  const handler = async (req: IncomingMessage, res: ServerResponse<IncomingMessage>): Promise<void> => {
    switch (req.method?.toUpperCase()) {
      case 'DELETE':
      case 'POST':
      case 'GET':
        break
      default:
        throw new Error(`Method not allowed ${req.method}`)
    }

    if (req.method === 'GET') {
      const searchParams = new URL(req.url as string, 'http://localhost').searchParams
      const key = searchParams.get('key')

      res.statusCode = 200
      res.end(isNil(key) ? '' : prestoreData[key] ?? '')
      return
    }

    if (req.method === 'POST') {
      // 读取 IncomingMessage  req 的请求体 并转换为 json
      const json = await new Promise<{ key: string, value: string }>((resolve, reject) => {
        const body: Buffer[] = []
        req.on('data', chunk => body.push(chunk))
        req.on('end', () => resolve(JSON.parse(Buffer.concat(body).toString())))
        req.on('error', err => reject(err))
      })

      prestoreData[json.key] = json.value
    }
    else if (req.method === 'DELETE') {
      const json = await new Promise<{ key: string, value: string }>((resolve, reject) => {
        const body: Buffer[] = []
        req.on('data', chunk => body.push(chunk))
        req.on('end', () => resolve(JSON.parse(Buffer.concat(body).toString())))
        req.on('error', err => reject(err))
      })
      delete prestoreData[json.key]
    }

    if (prestoreIndexJsonPath) {
      writeFileSync(prestoreIndexJsonPath, JSON.stringify(prestoreData, null, 2), { encoding: 'utf-8' })
    }

    res.statusCode = 200
    res.end()
  }

  return {
    prestoreRoot,
    prestoreIndexJsonPath,
    prestoreData,
    handler,
  }
}
