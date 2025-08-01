import type { IncomingMessage, ServerResponse } from 'node:http'
import type { UnpluginContext, UnpluginFactory } from 'unplugin'
import type { Options } from './types'
import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import c from 'ansis'
import bodyParser from 'body-parser'
import { assign, isArray, isNil, trim, trimEnd } from 'lodash-es'
import { createUnplugin } from 'unplugin'

const REPLACE_PRESTORE_DATA_KEY = '__GUELETON_PRESTORE_DATA__'
const REPLACE_API_PREFIX_KEY = '__GUELETON_API_PREFIX__'

const DEFAULT_API_PREFIX = '/__gueleton'

// eslint-disable-next-line unused-imports/no-unused-vars
export const unpluginFactory: UnpluginFactory<Options | undefined> = (options) => {
  let unpluginContext: UnpluginContext | null = null
  let apiPrefix: string = `${trimEnd(DEFAULT_API_PREFIX, '/')}`

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
        res.setHeader('Content-Type', 'text/plain')
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

  const allHandler = async (req: IncomingMessage, res: ServerResponse<IncomingMessage>): Promise<void> => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(prestoreData))
  }

  const panelPagePath: string = fileURLToPath(new URL('./client/panel.html', import.meta.url))
  const panelPageHandler = async (req: IncomingMessage, res: ServerResponse<IncomingMessage>): Promise<void> => {
    const page = await readFile(panelPagePath, { encoding: 'utf-8' })
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')
    res.end(page.replaceAll(REPLACE_API_PREFIX_KEY, JSON.stringify(apiPrefix)))
  }

  return {
    name: 'unplugin-gueleton',
    async buildStart() {
      await mkdir(prestoreRoot, { recursive: true })
      if (!existsSync(prestoreIndexJsonPath)) {
        try {
          await writeFile(prestoreIndexJsonPath, '{}', { encoding: 'utf-8' })
          unpluginContext?.warn(`Initialed prestore data at ${prestoreIndexJsonPath}`)
        }
        catch (err) {
          unpluginContext?.error(`Failed to write prestore data to ${prestoreIndexJsonPath}`)
          throw err
        }
      }

      try {
        const _prestoreData = JSON.parse(await readFile(prestoreIndexJsonPath, { encoding: 'utf-8' }) || '{}')
        assign(prestoreData, _prestoreData)
      }
      catch (err) {
        unpluginContext?.error(`Failed to read prestore data from ${prestoreIndexJsonPath}`)
        throw err
      }
    },
    transform: {
      filter: {
        id: /\.([mc])?([jt])sx?(\S*)$/,
        code: {
          include: [REPLACE_PRESTORE_DATA_KEY, REPLACE_API_PREFIX_KEY],
        },
      },
      handler(code) {
        if (!unpluginContext) {
          // eslint-disable-next-line ts/no-this-alias
          unpluginContext = this
        }

        return code
          .replaceAll(REPLACE_PRESTORE_DATA_KEY, JSON.stringify(prestoreData))
          .replaceAll(REPLACE_API_PREFIX_KEY, JSON.stringify(`/${trim(apiPrefix, '/')}`))
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

        const base = server.config.base || '/'
        apiPrefix = `${trimEnd(base, '/')}/${trim(DEFAULT_API_PREFIX, '/')}`

        server.middlewares.use(`${apiPrefix}/storage/all`, allHandler)
        server.middlewares.use(`${apiPrefix}/storage`, handler)
        server.middlewares.use(`${apiPrefix}`, panelPageHandler)

        /**
         * @see https://github.com/antfu-collective/vite-plugin-inspect/blob/a9128d5234e1377574a687ddc637b1bbc7de511c/src/node/index.ts#L145
         */
        const _printUrls = server.printUrls
        const config = server.config
        server.printUrls = () => {
          let host = `${config.server.https ? 'https' : 'http'}://localhost:${config.server.port || '80'}`

          const url = server.resolvedUrls?.local[0]

          if (url) {
            try {
              const u = new URL(url)
              host = `${u.protocol}//${u.host}`
            }
            catch (error) {
              config.logger.warn(`Parse resolved url failed: ${error}`)
            }
          }

          _printUrls()

          const colorUrl = (url: string): string => c.green(url.replace(/:(\d+)\//, (_, port) => `:${c.bold(port)}/`))

          config.logger.info(`  ${c.green('➜')}  ${c.bold('Gueleton')}: ${colorUrl(`${host}/${trim(apiPrefix, '/')}/`)}`)
        }
      },
    },
    webpack(compiler) {
      const options = compiler.options
      if (isNil(options.devServer) || options.devServer === false) {
        return
      }

      options.devServer = {
        setupMiddlewares: (middlewares: any) => {
          middlewares.push(
            {
              name: 'gueleton-all',
              path: `${apiPrefix}/storage/all`,
              middleware: allHandler,
            },
            {
              name: 'gueleton',
              path: `${apiPrefix}/storage`,
              middleware: handler,
            },
            {
              name: 'gueleton-panel',
              path: `${apiPrefix}`,
              middleware: panelPageHandler,
            },
          )

          return middlewares
        },
      }
    },
  }
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
