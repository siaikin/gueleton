import type { PartialDeep } from 'type-fest'
import type { GueletonOptions } from './options'
import type { SkeletonStorage } from './storage'
import { isNil, merge } from 'lodash-es'
import { DefaultGueletonOptions } from './options'
import { PrestoreDataStorage } from './storage'

export type GueletonProviderOptions = Omit<GueletonOptions<any>, 'dataKey' | 'data' | 'prestoreData' | 'loading'>

class _Provider {
  options: GueletonProviderOptions
  storage: SkeletonStorage

  constructor(
    options: PartialDeep<GueletonProviderOptions>,
  ) {
    this.options = merge({}, { ...DefaultGueletonOptions }, options)

    this.storage = PrestoreDataStorage
  }

  updateOptions(options: Partial<GueletonProviderOptions>): void {
    this.options = merge({}, this.options, options)
  }

  async getPrestoreData<T>(id: string): Promise<T | undefined> {
    try {
      const item = await this.storage.getItem(id)
      return item ? JSON.parse(item) : undefined
    }
    catch (err) {
      console.warn(`getPrestoreData error: ${err}`)
      return undefined
    }
  }

  async setPrestoreData<T>(id: string, data: T): Promise<void> {
    try {
      await this.storage.setItem(id, JSON.stringify(data))
    }
    catch (err) {
      console.warn(`setPrestoreData error: ${err}`)
    }
  }

  async hasPrestoreData(id: string): Promise<boolean> {
    const temp = await this.storage.getItem(id)
    return !isNil(temp) && temp.length > 0
  }
}

const GueletonProvider = new _Provider({})

export { GueletonProvider }
