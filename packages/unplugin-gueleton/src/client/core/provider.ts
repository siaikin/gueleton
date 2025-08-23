import type { StandardProperties } from 'csstype'
import type { SkeletonOptions } from './options'
import { isNil, merge } from 'lodash-es'
import { DefaultSkeletonOptions } from '../../shared'
import { DevelopmentStorage, ProductionStorage } from '../core/storage'

class _Provider<CSSTYPE = StandardProperties> {
  options: SkeletonOptions<CSSTYPE>
  storage: DevelopmentStorage | ProductionStorage

  constructor(
    options: Partial<SkeletonOptions<CSSTYPE>>,
  ) {
    this.options = merge({}, DefaultSkeletonOptions, options)

    // eslint-disable-next-line node/prefer-global/process
    this.storage = process.env.NODE_ENV === 'production' ? new ProductionStorage() : new DevelopmentStorage()
  }

  updateOptions(options: Partial<SkeletonOptions<CSSTYPE>>): void {
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

const Provider = new _Provider({})

export { Provider }
