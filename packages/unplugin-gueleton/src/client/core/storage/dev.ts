import type { SkeletonStorage } from '.'
import { isNil, trim } from 'lodash-es'

// eslint-disable-next-line ts/ban-ts-comment
// @ts-expect-error
const apiPrefix = __GUELETON_API_PREFIX__ as string
// eslint-disable-next-line ts/ban-ts-comment
// @ts-expect-error
const serverPort = __GUELETON_SERVER_PORT__ as number | null

/**
 * 开发环境下的 Storage 实现.
 *
 * set 操作会将数据发送到开发服务器并存储. 存储的数据在项目构建时会嵌入到代码中.
 */
export class DevelopmentStorage implements SkeletonStorage {
  private apiPrefix: string

  constructor() {
    const { port, protocol, hostname} = location ?? { port: 80, protocol: 'http:', hostname: 'localhost' }

    /**
     * serverPort 默认为 0, 未设置时默认使用所在页面的 port.
     *
     * 当在可扩展的 devServer(如: nuxt, vite) 中通过添加路由处理程序(而不是新建 http server)支持预存数据处理时, 很有用.
     */
    const _serverPort = (isNil(serverPort) || serverPort <= 0) ? (port ?? 80) : serverPort

    this.apiPrefix = `${protocol}//${hostname}:${_serverPort}/${trim(apiPrefix, '/')}`
  }

  async getItem(key: string): Promise<string> {
    const url = new URL(`${this.apiPrefix}/storage`, location?.href)
    url.searchParams.set('key', key)
    const res = await fetch(url.toString(), { method: 'GET' })
    return await res.text()
  }

  async removeItem(key: string): Promise<void> {
    await fetch(`${this.apiPrefix}/storage`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      body: JSON.stringify({ key }),
    })
  }

  async setItem(key: string, value: string): Promise<void> {
    await fetch(`${this.apiPrefix}/storage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      body: JSON.stringify({ key, value }),
    })
  }
}
