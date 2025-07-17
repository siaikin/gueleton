import type { UnpluginFactory } from 'unplugin'
import type { Options } from './types'
import { Buffer } from 'node:buffer'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import process from 'node:process'
import { isArray, trimEnd } from 'lodash-es'
import { createUnplugin } from 'unplugin'

let prestoreData: Record<string, string> = {}
let prestoreRoot: string | null = null
let prestoreIndexJsonPath: string | null = null

prestoreRoot = `${trimEnd(process.cwd(), '/')}/.gueleton`
mkdirSync(prestoreRoot, { recursive: true })

prestoreIndexJsonPath = `${prestoreRoot}/index.json`
// 判断文件存在
if (!existsSync(prestoreIndexJsonPath)) {
  writeFileSync(prestoreIndexJsonPath, '{}', { encoding: 'utf-8' })
}
const jsonString = readFileSync(prestoreIndexJsonPath, { encoding: 'utf-8' }) || '{}'
prestoreData = JSON.parse(jsonString)

// eslint-disable-next-line unused-imports/no-unused-vars
export const unpluginFactory: UnpluginFactory<Options | undefined> = options => ({
  name: 'unplugin-gueleton',
  // buildStart() {
  //   prestoreRoot = `${trimEnd(process.cwd(), '/')}/.gueleton`
  //   console.log(prestoreRoot)
  //   mkdirSync(prestoreRoot, { recursive: true })

  //   prestoreIndexJsonPath = `${prestoreRoot}/index.json`
  //   const jsonString = readFileSync(prestoreIndexJsonPath, { encoding: 'utf-8' }) || '{}'
  //   prestoreData = JSON.parse(jsonString)
  // },
  transform: {
    // filter: {
    //   code: {
    //     include: '__GUELETON_PRESTORE_DATA__',
    //   },
    // },
    handler(code, id) {
      console.log(id)
      if (code.includes('__GUELETON_PRESTORE_DATA__')) {
        return code.replace('__GUELETON_PRESTORE_DATA__', JSON.stringify(prestoreData))
      }
      return code;
    },
  },
  vite: {
    configureServer(server) {
      if (prestoreRoot) {
        if (isArray(server.watcher.options.ignored)) {
          server.watcher.options.ignored.push(prestoreRoot)
        } else if (server.watcher.options.ignored) {
          server.watcher.options.ignored = [server.watcher.options.ignored, prestoreRoot]
        }
      }

      server.middlewares.use('/gueleton-api/storage', async (req, res) => {
        if (req.method === 'GET') {
          throw new Error(`Method not allowed ${req.method}`)
        }
        else if (req.method === 'POST') {
          // 读取 IncomingMessage  req 的请求体 并转换为 json
          const json = await new Promise<{ key: string, value: string }>((resolve, reject) => {
            const body: Buffer[] = []
            req.on('data', chunk => body.push(chunk))
            req.on('end', () => {
              const bodyJson = JSON.parse(Buffer.concat(body).toString())
              resolve(bodyJson)
            })
            req.on('error', err => reject(err))
          })

          prestoreData[json.key] = json.value
        }
        else if (req.method === 'DELETE') {
          const json = await new Promise<{ key: string, value: string }>((resolve, reject) => {
            const body: Buffer[] = []
            req.on('data', chunk => body.push(chunk))
            req.on('end', () => {
              const bodyJson = JSON.parse(Buffer.concat(body).toString())
              resolve(bodyJson)
            })
            req.on('error', err => reject(err))
          })
          delete prestoreData[json.key]
        }
        else if (req.method === 'PUT') {
          throw new Error(`Method not allowed ${req.method}`)
        }
        else {
          throw new Error(`Method not allowed ${req.method}`)
        }

        if (prestoreIndexJsonPath) {
          writeFileSync(prestoreIndexJsonPath, JSON.stringify(prestoreData), { encoding: 'utf-8' })
        }

        res.statusCode = 200
        res.end()
      })
    },
  },
  webpack() {
  },
})

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
