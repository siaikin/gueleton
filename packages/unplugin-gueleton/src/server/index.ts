import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Options } from '../types'
import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import appRootPath from 'app-root-path'
import bodyParser from 'body-parser'
import chalk from 'chalk'
import { assign, isNil, merge, trim, trimEnd } from 'lodash-es'
import { getPortPromise } from 'portfinder'
import HttpServer from './http-server'

export const REPLACE_PRESTORE_DATA_KEY = '__GUELETON_PRESTORE_DATA__'
export const REPLACE_API_PREFIX_KEY = '__GUELETON_API_PREFIX__'
export const REPLACE_SERVER_PORT_KEY = '__GUELETON_SERVER_PORT__'
export const REPLACE_BUILD_MODE_KEY = '__GUELETON_BUILD_MODE__'

export interface GueletonServerOptions extends Options {
}

const DEFAULT_API_PREFIX = '/__gueleton'

const prestoreData: Record<string, string> = {}

const server: HttpServer = new HttpServer(false)

type Handler = (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => Promise<void>

let _port: number | null = null
async function resolvePort(): Promise<number> {
  if (_port === null) {
    _port = await getPortPromise({ port: 5679 })
  }
  return _port
}

export function createGueletonServer(options: GueletonServerOptions = {}): {
  prestoreRootDir: string
  initial: () => Promise<void>
  transformCode: (code: string) => Promise<string>
  startServer: () => Promise<void>
  stopServer: () => Promise<void>
  setupHandlers: (callback: (handlers: { route: string, handler: Handler }[]) => void) => void
  setupPort: (port: number) => void
  prettyServerUrl: (https?: boolean, port?: number | string) => string
} {
  const _options = merge({ debug: false }, options)

  server.debug = _options.debug

  const apiPrefix = `/${trim(DEFAULT_API_PREFIX, '/')}`

  const prestoreRootDir: string = `${trimEnd(appRootPath.path, '/')}/.gueleton`
  const prestoreIndexJsonPath: string = `${prestoreRootDir}/index.json`

  const jsonParser = bodyParser.json()

  const initial = async (): Promise<void> => {
    await mkdir(prestoreRootDir, { recursive: true })
    if (!existsSync(prestoreIndexJsonPath)) {
      try {
        await writeFile(prestoreIndexJsonPath, '{}', { encoding: 'utf-8' })
        console.warn(`Initialed prestore data at ${prestoreIndexJsonPath}`)
      }
      catch (err) {
        console.error(`Failed to write prestore data to ${prestoreIndexJsonPath}`)
        throw err
      }
    }

    try {
      const _prestoreData = JSON.parse(await readFile(prestoreIndexJsonPath, { encoding: 'utf-8' }) || '{}')
      assign(prestoreData, _prestoreData)
    }
    catch (err) {
      console.error(`Failed to read prestore data from ${prestoreIndexJsonPath}`)
      throw err
    }
  }

  const transformCode = async (code: string): Promise<string> => {
    const port = await resolvePort()

    return code
      .replaceAll(REPLACE_PRESTORE_DATA_KEY, JSON.stringify(prestoreData))
      .replaceAll(REPLACE_API_PREFIX_KEY, JSON.stringify(`/${trimEnd(apiPrefix, '/')}`))
      .replaceAll(REPLACE_SERVER_PORT_KEY, port.toString())
      // eslint-disable-next-line node/prefer-global/process
      .replaceAll(REPLACE_BUILD_MODE_KEY, JSON.stringify(process.env.NODE_ENV === 'production' ? 'production' : 'development'))
  }

  const prestoreDataHandler = async (req: IncomingMessage, res: ServerResponse<IncomingMessage>): Promise<void> => {
    try {
      await new Promise<void>((resolve, reject) => jsonParser(req, res, err => isNil(err) ? resolve() : reject(err)))
    }
    catch (err) {
      console.error(`jsonParser error: ${err}`)
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
        console.error(`Method not allowed ${req.method}`)
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
      console.error(`Failed to write prestore data to ${prestoreIndexJsonPath}, err: ${err}`)
      res.statusCode = 500
      res.end()
      throw err
    }
  }

  const allPrestoreDataHandler = async (req: IncomingMessage, res: ServerResponse<IncomingMessage>): Promise<void> => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(prestoreData))
  }

  const panelPagePath: string = fileURLToPath(new URL('./assets/panel.html', import.meta.url))
  const panelPageHandler = async (req: IncomingMessage, res: ServerResponse<IncomingMessage>): Promise<void> => {
    const page = await readFile(panelPagePath, { encoding: 'utf-8' })
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')
    res.end(page.replaceAll(REPLACE_API_PREFIX_KEY, JSON.stringify(apiPrefix)))
  }
  const panelPageFaviconPath: string = fileURLToPath(new URL('./assets/favicon.svg', import.meta.url))
  const panelPageFaviconHandler = async (req: IncomingMessage, res: ServerResponse<IncomingMessage>): Promise<void> => {
    const page = await readFile(panelPageFaviconPath)
    res.statusCode = 200
    res.setHeader('Content-Type', 'image/svg+xml')
    res.end(page)
  }

  /**
   * 数组顺序会影响处理程序的优先级, 越靠前优先级越高
   */
  const _handlers = [
    { route: `${apiPrefix}/storage/all`, handler: allPrestoreDataHandler },
    { route: `${apiPrefix}/storage`, handler: prestoreDataHandler },
    { route: `${apiPrefix}/favicon.svg`, handler: panelPageFaviconHandler },
    { route: `${apiPrefix}`, handler: panelPageHandler },
  ]

  const startServer = async (): Promise<void> => {
    if (server.listening) {
      return
    }

    for (const { route, handler } of _handlers) {
      server?.use(route, handler)
    }

    await server?.start(await resolvePort())
  }
  const stopServer = async (): Promise<void> => {
    await server?.stop()
  }

  const setupHandlers = (callback: (handlers: { route: string, handler: Handler }[]) => void): void => {
    callback(_handlers)
  }
  const setupPort = (port: number): void => {
    _port = port
  }

  const prettyServerUrl = (https?: boolean, _port: number | string = server.port): string => {
    /**
     * @see https://github.com/antfu-collective/vite-plugin-inspect/blob/a9128d5234e1377574a687ddc637b1bbc7de511c/src/node/index.ts#L145
     */
    const host = `${https ? 'https' : 'http'}://localhost:${_port}`

    const colorUrl = (url: string): string => chalk.green(url.replace(/:(\d+)\//, (_, port) => `:${chalk.bold(port)}/`))

    return `${chalk.green('➜')}  ${chalk.bold('Gueleton')}: ${colorUrl(`${host}/${trim(apiPrefix, '/')}/`)}`
  }

  return {
    initial,
    transformCode,
    prestoreRootDir,
    startServer,
    stopServer,
    setupHandlers,
    setupPort,
    prettyServerUrl,
  }
}
