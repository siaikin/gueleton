import type { SkeletonStorage } from '.'

/**
 * 开发环境下的 Storage 实现.
 *
 * set 操作会将数据发送到开发服务器并存储. 存储的数据在项目构建时会嵌入到代码中.
 */
export class DevelopmentStorage implements SkeletonStorage {
  constructor() {
  }

  async getItem(key: string): Promise<string | null> {
    const url = new URL('/gueleton-api/storage', location.href)
    url.searchParams.set('key', key)
    const res = await fetch(url.toString(), { method: 'GET' })
    const a = await res.text()
    return a
  }

  async removeItem(key: string): Promise<void> {
    await fetch('/gueleton-api/storage', {
      method: 'DELETE',
      body: JSON.stringify({ key }),
    })
  }

  async setItem(key: string, value: string): Promise<void> {
    await fetch('/gueleton-api/storage', {
      method: 'POST',
      body: JSON.stringify({ key, value }),
    })
  }
}
