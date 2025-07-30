import { SkeletonOptions } from "../../../shared"
import { createSkeletonBone, createSkeletonContainer, setupSkeletonBone, setupSkeletonContainer } from "../setup-skeleton-bone"
import { isBoneable } from "../is-bone"
import { assignStyles, getChildNodes, SkipChildren, walk } from "../utils"
import { resetMountPoint, setupMountPoint } from "../setup-mount-point"
import { CopiedCssProperties } from "../constants"

export function skeletonInPlacePlugin<CSSTYPE>(root: HTMLElement, options: SkeletonOptions<CSSTYPE>) {
  const bones = new Map<HTMLElement, HTMLElement>()

  walk<HTMLElement | Node>(
    root,
    node => getChildNodes(node),
    (child) => {
      if (!isBoneable(child, options.fuzzy) || !(child instanceof HTMLElement)) {
        return
      }

      const boneContainer = createSkeletonContainer(child, options)
      setupSkeletonContainer(boneContainer, options)

      const boneNode = createSkeletonBone(child, options)
      assignStyles(boneNode, child, CopiedCssProperties)
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
    }
  }
}