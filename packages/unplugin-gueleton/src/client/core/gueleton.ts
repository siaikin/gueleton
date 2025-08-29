import type { InternalGueletonOptions, SkeletonOptions } from './options'
import { isNil, isNumber, merge } from 'lodash-es'
import { GueletonProvider } from './gueleton-provider'
import { prune } from './prune'
import { skeleton } from './skeleton'

export class Gueleton<DATA> {
  provider: typeof GueletonProvider

  dataKey: string

  prestoreData: InternalGueletonOptions<DATA>['prestoreData']

  prestoreDataResolved: boolean = false

  private _unmountSkeleton: (() => void) | null = null

  constructor(
    dataKey: string,
    prestoreData?: InternalGueletonOptions<DATA>['prestoreData'],
    provider: typeof GueletonProvider = GueletonProvider,
  ) {
    this.dataKey = dataKey
    this.prestoreData = prestoreData
    this.provider = provider
  }

  public async resolvePrestoreData(): Promise<void> {
    if (isNil(this.prestoreData)) {
      /**
       * 仅当 prestoreData 来自于 getPrestoreData 时才会被标记为 resolved. 这将确保用户手动设置的 prestoreData 不会被保存到 devServer.
       */
      this.prestoreData = await this.provider.getPrestoreData<DATA>(this.dataKey)

      this.prestoreDataResolved = true
    }
  }

  public async setupPrestoreData(data: InternalGueletonOptions<DATA>['data'], limit: InternalGueletonOptions<DATA>['limit'] = {}): Promise<void> {
    const _limit = merge(
      {},
      isNumber(this.provider.options.limit) ? { length: this.provider.options.limit } : this.provider.options.limit,
      isNumber(limit) ? { length: limit } : limit,
    )

    await this.provider.setPrestoreData(this.dataKey, prune(data, _limit))
    // 保存成功后, 更新 prestoreData
    this.prestoreData = await this.provider.getPrestoreData(this.dataKey)
  }

  public mount(target: Node, styleOptions?: Partial<SkeletonOptions>): void {
    this.unmount()

    this._unmountSkeleton = skeleton(target, merge({}, this.provider.options.skeleton, styleOptions))
  }

  public unmount(): void {
    this._unmountSkeleton?.()
    this._unmountSkeleton = null
  }
}
