import type * as CSS from 'csstype'
import type { PruneOptions } from './prune'

export interface SkeletonOptions<CSSTYPE = CSS.StandardProperties> {
  fuzzy: number
  type: 'overlay' | 'inPlace'
  bone: SkeletonBoneOptions<CSSTYPE>
  container: SkeletonContainerOptions<CSSTYPE>
  /**
   * 预存数据的裁剪规则. 接受一个 number 或 对象.
   * - 当 limit 为 number 时, 表示取前 limit 项, 仅对数组有效.
   * - 当 limit 为对象时, length 表示取前 length 项, properties 表示裁剪对象的属性, 仅对对象有效.
   */
  limit: PruneOptions
}

export interface SkeletonBoneOptions<CSSTYPE> {
  style?: CSSTYPE
  className?: string | string[]
}

export interface SkeletonContainerOptions<CSSTYPE> {
  style?: CSSTYPE
  className?: string | string[]
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
  limit: 3,
}
