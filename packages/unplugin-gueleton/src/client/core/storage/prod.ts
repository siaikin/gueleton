import { DevelopmentStorage } from './dev'

// eslint-disable-next-line ts/ban-ts-comment
// @ts-expect-error
const prestoreData = __GUELETON_PRESTORE_DATA__ as Record<string, any>

export class ProductionStorage extends DevelopmentStorage {
  protected storage: Map<string, string> = new Map()

  constructor() {
    super()
    for (const key in prestoreData) {
      this.storage.set(key, prestoreData[key])
    }
  }

  async getItem(key: string): Promise<string> {
    return this.storage.get(key) ?? ''
  }

  setItem(_: string, __: string): Promise<void> {
    return Promise.resolve()
  }

  removeItem(_: string): Promise<void> {
    return Promise.resolve()
  }
}
