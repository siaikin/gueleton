import { SkeletonOptions } from "./options"

export interface SkeletonPlugin<CSSTYPE> {
  (root: HTMLElement, options: SkeletonOptions<CSSTYPE>): {
    name: string
    mount(): void
    unmount(): void
  }
}
