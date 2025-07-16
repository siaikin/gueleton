import type { SkeletonStorage } from '.'

// eslint-disable-next-line ts/ban-ts-comment
// @ts-expect-error
const presotreData = __GUELETON_PRESTORE_DATA__ as Record<string, any>

/**
 * 开发环境下的 Storage 实现.
 *
 * set 操作会将数据发送到开发服务器并存储. 存储的数据在项目构建时会嵌入到代码中.
 */
export class DevelopmentStorage implements SkeletonStorage {
  protected storage: Map<string, string> = new Map()

  constructor() {
    for (const key in presotreData) {
      this.storage.set(key, presotreData[key])
    }
  }

  get length(): number {
    throw new Error('Not implemented')
  }

  clear(): void {
  }

  getItem(key: string): string | null {
    return this.storage.get(key) ?? null
  }

  key(_: number): string | null {
    throw new Error('Not implemented')
  }

  async removeItem(key: string): Promise<void> {
    await fetch('/gueleton-api/storage', {
      method: 'DELETE',
      body: JSON.stringify({
        key,
      }),
    })

    this.storage.delete(key)
  }

  async setItem(key: string, value: string): Promise<void> {
    await fetch('/gueleton-api/storage', {
      method: 'POST',
      body: JSON.stringify({ key, value }),
    })

    this.storage.set(key, value)
  }
}
