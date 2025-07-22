import type * as CSS from 'csstype'

export interface SkeletonOptions<CSSTYPE = CSS.StandardProperties & CSS.StandardPropertiesHyphen> {
  /**
   * 精度.
   */
  depth: number
  bone: SkeletonBoneOptions<CSSTYPE>
  container: SkeletonContainerOptions<CSSTYPE>
}

export interface SkeletonBoneOptions<CSSTYPE> {
  style: Omit<CSSTYPE, 'width' | 'height'>
  className: string | string[]
}

export interface SkeletonContainerOptions<CSSTYPE> {
  style: Omit<CSSTYPE, 'width' | 'height' | 'position' | 'top' | 'left' | 'margin'>
  className: string | string[]
}

export const DefaultSkeletonOptions: SkeletonOptions = {
  depth: 1,
  bone: {
    style: {
      backgroundColor: 'rgba(240, 240, 240, 1)',
      borderRadius: '8px',
    },
    className: '',
  },
  container: {
    style: {
      backgroundColor: 'rgba(255, 255, 255, 1)',
    },
    className: '',
  },
}
