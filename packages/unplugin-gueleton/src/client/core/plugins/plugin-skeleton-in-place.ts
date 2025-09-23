import type { SkeletonOptions, SkeletonPlugin } from '../../../shared'
import { CopiedCssPropertiesWithoutMargin } from '../constants'
import { isBoneable } from '../is-bone'
import { resetMountPoint, setupMountPoint } from '../setup-mount-point'
import { createSkeletonBone, setupSkeletonBone } from '../setup-skeleton-bone'
import { createSkeletonContainer, removeSkeletonContainer, setupSkeletonContainer } from '../setup-skeleton-container'
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
      setupSkeletonContainer(boneContainer, options.container)

      const boneNode = createSkeletonBone(child, options)
      assignStyles(boneNode, child, CopiedCssPropertiesWithoutMargin)
      setupSkeletonBone(boneNode, child, options.bone)

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
    async unmount() {
      await Promise.all(
        Array.from(bones.entries())
          .map(async ([child, bone]) => {
            await removeSkeletonContainer(bone, options.container)
            resetMountPoint(child)
          }),
      )
      bones.clear()
    },
  }
}
