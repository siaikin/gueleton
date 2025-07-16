import { DevelopmentStorage } from './dev'

export class ProductionStorage extends DevelopmentStorage {
  getItem(key: string): string | null {
    return this.storage.get(key) ?? null
  }

  setItem(_: string, __: string): Promise<void> {
    return Promise.resolve()
  }

  removeItem(_: string): Promise<void> {
    return Promise.resolve()
  }
}
