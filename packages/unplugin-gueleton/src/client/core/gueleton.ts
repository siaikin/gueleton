import type { StandardProperties } from 'csstype'
import type { SkeletonOptions } from './options'
import type { PruneOptions } from './prune'
import { assign, isNil, isUndefined, merge, omit, pick } from 'lodash-es'
import { GueletonProvider } from './gueleton-provider'
import { prune } from './prune'
import { skeleton } from './skeleton'

interface InternalRequiredGueletonOptions {
  /**
   * 标记预存数据的 key, 可以在在面板中查看和操作预存数据.
   * 相同的 key 将共享相同的预存数据.
   */
  dataKey: string
}

interface InternalGueletonOptions<DATA, CSSTYPE> extends SkeletonOptions<CSSTYPE> {
  /**
   * 代理的原始数据. gueleton 将根据原始数据和 limit 参数生成预存数据.
   */
  data: DATA | null | undefined
  /**
   * 这个参数可以让你直接在代码中设置预存数据, 而不依赖构建时的 vite/webpack 插件.
   *
   * 注意: 在这里手动设置的 prestoreData 不会被保存到 devServer.
   */
  prestoreData: DATA | null | undefined
  /**
   * 控制是否显示骨架屏.
   */
  loading: boolean
  /**
   * 强制渲染组件, 即使没有预存数据.
   */
  forceRender: boolean
  /**
   * 预存数据的裁剪规则. 接受一个 number 或 对象.
   * - 当 limit 为 number 时, 表示取前 limit 项, 仅对数组有效.
   * - 当 limit 为对象时, length 表示取前 length 项, properties 表示裁剪对象的属性, 仅对对象有效.
   */
  limit: PruneOptions
}

export class Gueleton<DATA, CSSTYPE> {
  static DefaultOptions: InternalGueletonOptions<any, StandardProperties> = {
    data: undefined,
    prestoreData: undefined,
    loading: false,
    forceRender: false,
    limit: 3,
    ...GueletonProvider.options,
  }

  options: InternalGueletonOptions<DATA, CSSTYPE>

  dataKey: string

  prestoreData: InternalGueletonOptions<DATA, CSSTYPE>['prestoreData']

  prestoreDataResolved: boolean = false

  skeletonTarget?: Element | null | undefined

  get shouldRender(): boolean {
    const result = (() => {
      const { forceRender } = this.options
      if (this.options.loading) {
        return !isUndefined(this.prestoreData) || forceRender
      }
      return true
    })()
    return result
  }

  get renderData(): InternalGueletonOptions<DATA, CSSTYPE>['data'] | InternalGueletonOptions<DATA, CSSTYPE>['prestoreData'] {
    return this.options.loading ? this.prestoreData : this.options.data
  }

  private __unmountSkeleton: (() => void) | null = null

  constructor(
    dataKey: string,
    options: Partial<InternalGueletonOptions<DATA, CSSTYPE>>,
  ) {
    this.options = merge(
      {},
      { ...Gueleton.DefaultOptions, ...GueletonProvider.options },
      options,
    )
    this.dataKey = dataKey
    this._resolvePrestoreData()
  }

  public updateOptions(
    options: Partial<InternalGueletonOptions<DATA, CSSTYPE>>,
    targetElement?: () => Element | null | undefined,
  ): void {
    const _options = merge({}, this.options, omit(options, 'data'))
    // 考虑到 data 可能是个大对象, 使用 assign 进行浅拷贝
    assign(_options, pick(options, 'data'))
    this.options = _options

    this._savePrestoreData()

    this.onOptionsUpdate?.()

    queueMicrotask(() => {
      this.skeletonTarget = targetElement?.()
      this._unmountSkeleton()
      this._mountSkeleton()
    })
  }

  public onOptionsUpdate: (() => void) | undefined

  private async _savePrestoreData(): Promise<void> {
    if (!this.prestoreDataResolved || !isUndefined(this.prestoreData) || isUndefined(this.options.data) || this.options.loading) {
      return
    }

    await GueletonProvider.setPrestoreData(this.dataKey, prune(this.options.data, this.options.limit))
    // 保存成功后, 更新 prestoreData
    this.prestoreData = await GueletonProvider.getPrestoreData(this.dataKey)
  }

  private _mountSkeleton(): void {
    if (isNil(this.skeletonTarget) || !this.options.loading) {
      return
    }

    this.__unmountSkeleton = skeleton(this.skeletonTarget, { ...this.options })
  }

  private _unmountSkeleton(): void {
    this.__unmountSkeleton?.()
    this.__unmountSkeleton = null
  }

  private async _resolvePrestoreData(): Promise<void> {
    if (isUndefined(this.options.prestoreData)) {
      /**
       * 仅当 prestoreData 来自于 getPrestoreData 时才会被标记为 resolved. 这将确保用户手动设置的 prestoreData 不会被保存到 devServer.
       */
      this.prestoreData = await GueletonProvider.getPrestoreData<DATA>(this.dataKey)

      this.prestoreDataResolved = true
      this.updateOptions({})
    }
  }
}

export type GueletonOptions<DATA, CSSTYPE> = Partial<InternalGueletonOptions<DATA, CSSTYPE>> & InternalRequiredGueletonOptions
