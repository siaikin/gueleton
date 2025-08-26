import type { SkeletonOptions, SkeletonPlugin } from '../../../shared'
import { isNil } from 'lodash-es'
import { CopiedCssProperties } from '../constants'
import { isBoneable } from '../is-bone'
import { resetMountPoint, setupMountPoint } from '../setup-mount-point'
import { createSkeletonBone, createSkeletonContainer, setupSkeletonBone, setupSkeletonContainer } from '../setup-skeleton-bone'
import { assignStyles, getChildNodes, isCustomElement, SkipChildren, walkWithMap } from '../utils'

export function skeletonOverlayPlugin<CSSTYPE>(root: HTMLElement, options: SkeletonOptions<CSSTYPE>): SkeletonPlugin {
  const tree = walkWithMap<HTMLElement | Node, HTMLElement>(
    root,
    node => getChildNodes(node),
    (child, parent, mappedParent, withFlag) => {
      if (child.nodeType !== Node.ELEMENT_NODE || !(child instanceof HTMLElement)) {
        return SkipChildren
      }
      /**
       * todo 检查可见行
       */
      // switch (child.nodeType) {
      //   case Node.ELEMENT_NODE: {
      //     if (!(child as Element).checkVisibility({ contentVisibilityAuto: true, opacityProperty: true, visibilityProperty: true })) {
      //       return SkipChildren
      //     }
      //     break
      //   }
      //   default:
      //     return SkipChildren
      // }

      if (isNil(mappedParent)) {
        const skeletonContainer = createSkeletonContainer(child, options)
        assignStyles(skeletonContainer, child, CopiedCssProperties)
        setupSkeletonContainer(skeletonContainer, options)

        return skeletonContainer
      }
      else if (isBoneable(child, options.fuzzy)) {
        const skeletonNode = createSkeletonBone(child, options)
        assignStyles(skeletonNode, child, CopiedCssProperties)
        setupSkeletonBone(skeletonNode, child, options)

        const rect = child.getBoundingClientRect()
        skeletonNode.style.setProperty('width', `${rect.width}px`)
        skeletonNode.style.setProperty('height', `${rect.height}px`)

        mappedParent.appendChild(skeletonNode)

        return withFlag(skeletonNode, SkipChildren)
      }
      else {
        const skeletonNode = document.createElement(isCustomElement(child) ? 'div' : child.nodeName.toLowerCase())

        assignStyles(skeletonNode, child, CopiedCssProperties)

        mappedParent.appendChild(skeletonNode)

        return skeletonNode
      }
    },
  )

  if (isNil(tree)) {
    throw new Error('skeletonOverlayPlugin: tree is nil')
  }

  return {
    name: 'skeleton-overlay',
    mount() {
      setupMountPoint(root)
      root.append(tree)
    },
    unmount() {
      resetMountPoint(root)
      tree.remove()
    },
  }
}
