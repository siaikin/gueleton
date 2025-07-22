import type { SkeletonOptions } from '../../shared'
import { domToSkeleton } from './dom-to-skeleton'
import { skeletonInPlace } from './skeleton-in-place'
import { skeletonToDom } from './skeleton-to-dom'

export function skeleton<CSSTYPE>(dom: Element, options: SkeletonOptions<CSSTYPE> & { inPlace?: boolean }): {
  attach: () => void
  detach: () => void
} {
  if (options.inPlace) {
    const { detachBone, attachBone } = skeletonInPlace(dom, options)
    return {
      detach: detachBone,
      attach: attachBone,
    }
  }
  else {
    let skeletonDom: Node | null = null
    return {
      attach: () => {
        const temp = domToSkeleton(dom, options)
        skeletonDom = skeletonToDom(temp)
        dom.appendChild(skeletonDom)
      },

      detach: () => {
        skeletonDom?.parentNode?.removeChild(skeletonDom)
      },
    }
  }
}

export { prune, type PruneOptions } from './prune'
