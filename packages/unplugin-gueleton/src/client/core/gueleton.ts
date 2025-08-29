import type { InternalGueletonOptions, SkeletonOptions } from './options'
import { isNil, merge } from 'lodash-es'
import { GueletonProvider } from './gueleton-provider'
import { prune } from './prune'
import { skeleton } from './skeleton'

export class Gueleton<DATA> {
  dataKey: string

  prestoreData: InternalGueletonOptions<DATA>['prestoreData']

  prestoreDataResolved: boolean = false

  private _unmountSkeleton: (() => void) | null = null

  constructor(
    dataKey: string,
    prestoreData?: InternalGueletonOptions<DATA>['prestoreData'],
  ) {
    this.dataKey = dataKey

    this.prestoreData = prestoreData
  }

  public async resolvePrestoreData(): Promise<void> {
    if (isNil(this.prestoreData)) {
      /**
       * 仅当 prestoreData 来自于 getPrestoreData 时才会被标记为 resolved. 这将确保用户手动设置的 prestoreData 不会被保存到 devServer.
       */
      this.prestoreData = await GueletonProvider.getPrestoreData<DATA>(this.dataKey)

      this.prestoreDataResolved = true
    }
  }


  public async setupPrestoreData(data: InternalGueletonOptions<DATA>['data'], limit?: InternalGueletonOptions<DATA>['limit']): Promise<void> {
    await GueletonProvider.setPrestoreData(this.dataKey, prune(data, limit))
    // 保存成功后, 更新 prestoreData
    this.prestoreData = await GueletonProvider.getPrestoreData(this.dataKey)
  }

  public mount(target: Node, styleOptions?: Partial<SkeletonOptions>): void {
    this.unmount()

    this._unmountSkeleton = skeleton(target, merge({}, GueletonProvider.options.skeleton, styleOptions))
  }

  public unmount(): void {
    this._unmountSkeleton?.()
    this._unmountSkeleton = null
  }
}
