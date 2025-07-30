import type { IncomingMessage, ServerResponse } from 'node:http'
import type { UnpluginContext, UnpluginFactory } from 'unplugin'
import type { Options } from './types'
import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import process from 'node:process'
import bodyParser from 'body-parser'
import { assign, isArray, isNil, trimEnd } from 'lodash-es'
import { createUnplugin } from 'unplugin'

const PRESTORE_DATA_KEY = '__GUELETON_PRESTORE_DATA__'

// eslint-disable-next-line unused-imports/no-unused-vars
export const unpluginFactory: UnpluginFactory<Options | undefined> = (options) => {
  let unpluginContext: UnpluginContext | null = null

  const prestoreRoot: string = `${trimEnd(process.cwd(), '/')}/.gueleton`
  const prestoreIndexJsonPath: string = `${prestoreRoot}/index.json`

  const prestoreData: Record<string, string> = {}

  const jsonParser = bodyParser.json()
  const handler = async (req: IncomingMessage, res: ServerResponse<IncomingMessage>): Promise<void> => {
    try {
      await new Promise<void>((resolve, reject) => jsonParser(req, res, err => isNil(err) ? resolve() : reject(err)))
    }
    catch (err) {
      unpluginContext?.error(`jsonParser error: ${err}`)
      res.statusCode = 400
      res.end()
      throw err
    }

    switch (req.method?.toUpperCase()) {
      case 'DELETE':
      case 'POST':
      case 'GET':
        break
      default:
        unpluginContext?.error(`Method not allowed ${req.method}`)
        res.statusCode = 405
        res.end()
        return
    }

    try {
      if (req.method === 'GET') {
        const searchParams = new URL(req.url as string, 'http://localhost').searchParams
        const key = searchParams.get('key')

        res.statusCode = 200
        res.end(isNil(key) ? '' : prestoreData[key] ?? '')
        return
      }

      if (req.method === 'POST') {
        // @ts-expect-error 缺少请求体类型定义
        const json = req.body

        prestoreData[json.key] = json.value
      }
      else if (req.method === 'DELETE') {
        // @ts-expect-error 缺少请求体类型定义
        const json = req.body
        delete prestoreData[json.key]
      }

      if (prestoreIndexJsonPath) {
        await writeFile(prestoreIndexJsonPath, JSON.stringify(prestoreData, null, 2), { encoding: 'utf-8' })
      }

      res.statusCode = 200
      res.end()
    }
    catch (err) {
      unpluginContext?.error(`Failed to write prestore data to ${prestoreIndexJsonPath}, err: ${err}`)
      res.statusCode = 500
      res.end()
      throw err
    }
  }

  return {
    name: 'unplugin-gueleton',
    async buildStart() {
      unpluginContext = this as unknown as UnpluginContext

      await mkdir(prestoreRoot, { recursive: true })
      if (!existsSync(prestoreIndexJsonPath)) {
        try {
          await writeFile(prestoreIndexJsonPath, '{}', { encoding: 'utf-8' })
          unpluginContext.warn(`Inited prestore data at ${prestoreIndexJsonPath}`)
        }
        catch (err) {
          unpluginContext.error(`Failed to write prestore data to ${prestoreIndexJsonPath}`)
          throw err
        }
      }

      try {
        const _prestoreData = JSON.parse(await readFile(prestoreIndexJsonPath, { encoding: 'utf-8' }) || '{}')
        assign(prestoreData, _prestoreData)
      }
      catch (err) {
        unpluginContext.error(`Failed to read prestore data from ${prestoreIndexJsonPath}`)
        throw err
      }
    },
    transform: {
      filter: {
        id: /\.(m|c)?(j|t)sx?$/,
        code: {
          include: PRESTORE_DATA_KEY,
        },
      },
      handler(code) {
        return code.replace(PRESTORE_DATA_KEY, JSON.stringify(prestoreData))
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
  }
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
