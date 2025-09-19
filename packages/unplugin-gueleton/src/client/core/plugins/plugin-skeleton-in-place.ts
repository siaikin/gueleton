import type { SkeletonOptions, SkeletonPlugin } from '../../../shared'
import { merge } from 'lodash-es'
import { CopiedCssPropertiesWithoutMargin } from '../constants'
import { isBoneable } from '../is-bone'
import { resetMountPoint, setupMountPoint } from '../setup-mount-point'
import { createSkeletonBone, createSkeletonContainer, setupSkeletonBone, setupSkeletonContainer } from '../setup-skeleton-bone'
import { assignStyles, getChildNodes, SkipChildren, walk } from '../utils'

export function skeletonInPlacePlugin<CSSTYPE>(root: HTMLElement, options: SkeletonOptions<CSSTYPE>): SkeletonPlugin {
  const bones = new Map<HTMLElement, HTMLElement>()

  walk<HTMLElement | Node>(
    root,
    node => getChildNodes(node),
    (child) => {
      if (!isBoneable(child, options.fuzzy) || !(child instanceof HTMLElement)) {
        return
      }

      const boneContainer = createSkeletonContainer(child, options)
      setupSkeletonContainer(
        boneContainer,
        /**
         * inPlace 模式下, container 的背景色没有意义.
         *
         * ~~除非用户指定, 否则设置为透明.~~ 现在, 我们强制设置为透明.
         */
        merge({}, options.container, { style: { backgroundColor: 'transparent' } }),
      )

      const boneNode = createSkeletonBone(child, options)
      assignStyles(boneNode, child, CopiedCssPropertiesWithoutMargin)
      setupSkeletonBone(boneNode, child, options)

      boneNode.style.setProperty('width', '100%')
      boneNode.style.setProperty('height', '100%')

      boneContainer.append(boneNode)

      bones.set(child, boneContainer)

      return SkipChildren
    },
  )

  return {
    name: 'skeleton-in-place',
    mount() {
      for (const [child, bone] of bones) {
        setupMountPoint(child)
        child.append(bone)
      }
    },
    unmount() {
      for (const [child, bone] of bones) {
        resetMountPoint(child)
        bone.remove()
      }
    },
  }
}
