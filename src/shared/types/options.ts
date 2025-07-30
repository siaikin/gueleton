import type * as CSS from 'csstype'

export interface SkeletonOptions<CSSTYPE = CSS.StandardProperties> {
  fuzzy: number
  type: 'overlay' | 'inPlace'
  bone: SkeletonBoneOptions<CSSTYPE>
  container: SkeletonContainerOptions<CSSTYPE>
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
