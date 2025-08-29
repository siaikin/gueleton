import type * as CSS from 'csstype'
import type { PruneOptions } from './prune'

export interface SkeletonOptions<CSSTYPE = CSS.StandardProperties> {
  fuzzy: number
  type: 'overlay' | 'inPlace'
  bone: Partial<SkeletonBoneOptions<CSSTYPE>>
  container: Partial<SkeletonContainerOptions<CSSTYPE>>
}

export interface SkeletonBoneOptions<CSSTYPE> {
  style: CSSTYPE
  className: string | string[]
}

export interface SkeletonContainerOptions<CSSTYPE> {
  style: CSSTYPE
  className: string | string[]
}

export const DefaultSkeletonOptions: SkeletonOptions = {
  fuzzy: 1,
  type: 'overlay',
  bone: {
    style: {
      backgroundColor: 'rgba(240, 240, 240, 1)',
    },
    className: '',
  },
  container: {
    style: {
      cursor: 'not-allowed',
      backgroundColor: 'rgba(255, 255, 255, 1)',
    },
    className: '',
  },
}

export interface InternalRequiredGueletonOptions {
  /**
   * 标记预存数据的 key, 可以在在面板中查看和操作预存数据.
   * 相同的 key 将共享相同的预存数据.
   */
  dataKey: string
}

export interface InternalGueletonOptions<DATA> {
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

export interface GueletonOptions<DATA> extends InternalGueletonOptions<DATA>, InternalRequiredGueletonOptions {
  skeleton: SkeletonOptions
}

export type PublicGueletonOptions<DATA> = Partial<Omit<GueletonOptions<DATA>, 'dataKey' | 'skeleton'>> & Pick<GueletonOptions<DATA>, 'dataKey'> & {
  skeleton?: Partial<SkeletonOptions>
}

export const DefaultGueletonOptions: Omit<GueletonOptions<any>, 'dataKey'> = {
  data: undefined,
  prestoreData: undefined,
  loading: false,
  forceRender: false,
  limit: 3,
  skeleton: { ...DefaultSkeletonOptions },
}
