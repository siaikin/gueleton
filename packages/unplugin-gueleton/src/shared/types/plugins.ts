import type { SkeletonOptions } from './options'

export interface SkeletonPlugin {
  name: string
  mount: () => void
  unmount: () => void
}

export type SkeletonPluginFactory<CSSTYPE> = (root: HTMLElement, options: SkeletonOptions<CSSTYPE>) => SkeletonPlugin
