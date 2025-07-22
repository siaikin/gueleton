import { DevelopmentStorage } from './dev'

// eslint-disable-next-line ts/ban-ts-comment
// @ts-expect-error
const presotreData = __GUELETON_PRESTORE_DATA__ as Record<string, any>

export class ProductionStorage extends DevelopmentStorage {
  protected storage: Map<string, string> = new Map()

  constructor() {
    super()
    for (const key in presotreData) {
      this.storage.set(key, presotreData[key])
    }
  }

  async getItem(key: string): Promise<string | null> {
    return this.storage.get(key) ?? null
  }

  setItem(_: string, __: string): Promise<void> {
    return Promise.resolve()
  }

  removeItem(_: string): Promise<void> {
    return Promise.resolve()
  }
}
