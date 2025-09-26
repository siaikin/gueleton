import type { InternalGueletonOptions, SkeletonOptions } from './options'
import { isFunction, isNil, isNumber, merge } from 'lodash-es'
import { GueletonProvider } from './gueleton-provider'
import { prune } from './prune'
import { skeleton } from './skeleton'

export class Gueleton<DATA> {
  provider: typeof GueletonProvider

  dataKey: string

  prestoreData: InternalGueletonOptions<DATA>['prestoreData']

  prestoreDataResolved: boolean = false

  private _unmountSkeleton: (() => Promise<void>) | null = null

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
    /**
     * target 不是 Element 时, 寻找下一个兄弟节点, 直到找到 Element 节点为止.
     *
     * 目前, 这仅用与处理 Vue template ref 中的边界情况.
     */
    let _target: Node | null = target
    while (!isNil(_target) && _target.nodeType !== Node.ELEMENT_NODE) {
      _target = _target.nextSibling
    }

    if (isNil(_target)) {
      return
    }

    this.unmount()

    this._unmountSkeleton = skeleton(_target, merge({}, this.provider.options.skeleton, styleOptions))
  }

  public async unmount(): Promise<void> {
    if (isFunction(this._unmountSkeleton)) {
      await this._unmountSkeleton()
    }

    this._unmountSkeleton = null
  }
}
