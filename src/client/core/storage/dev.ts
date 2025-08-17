import type { SkeletonStorage } from '.'
import { trim } from 'lodash-es'

// eslint-disable-next-line ts/ban-ts-comment
// @ts-expect-error
const apiPrefix = __GUELETON_API_PREFIX__ as string

/**
 * 开发环境下的 Storage 实现.
 *
 * set 操作会将数据发送到开发服务器并存储. 存储的数据在项目构建时会嵌入到代码中.
 */
export class DevelopmentStorage implements SkeletonStorage {
  constructor() {
  }

  async getItem(key: string): Promise<string> {
    const url = new URL(`/${trim(apiPrefix, '/')}/storage`, location.href)
    url.searchParams.set('key', key)
    const res = await fetch(url.toString(), { method: 'GET' })
    return await res.text()
  }

  async removeItem(key: string): Promise<void> {
    await fetch(`/${trim(apiPrefix, '/')}/storage`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      body: JSON.stringify({ key }),
    })
  }

  async setItem(key: string, value: string): Promise<void> {
    await fetch(`/${trim(apiPrefix, '/')}/storage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      body: JSON.stringify({ key, value }),
    })
  }
}
