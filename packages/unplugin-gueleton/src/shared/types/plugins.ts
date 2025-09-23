import type { SkeletonOptions } from '../../client/core/options'

export interface SkeletonPlugin {
  name: string
  mount: () => void | Promise<void>
  unmount: () => void | Promise<void>
}

export type SkeletonPluginFactory<CSSTYPE> = (root: HTMLElement, options: SkeletonOptions<CSSTYPE>) => SkeletonPlugin
