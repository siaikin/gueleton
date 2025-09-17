import type { SkeletonOptions, SkeletonPlugin } from '../../../shared'
import { isNil } from 'lodash-es'
import { CopiedCssProperties, CopiedCssPropertiesWithoutMargin } from '../constants'
import { isBoneable } from '../is-bone'
import { resetMountPoint, setupMountPoint } from '../setup-mount-point'
import { createSkeletonBone, createSkeletonContainer, setupSkeletonBone, setupSkeletonContainer } from '../setup-skeleton-bone'
import { assignStyles, getChildNodes, isCustomElement, SkipChildren, walkWithMap } from '../utils'

export function skeletonOverlayPlugin<CSSTYPE>(root: HTMLElement, options: SkeletonOptions<CSSTYPE>): SkeletonPlugin {
  const skeletonContainer = createSkeletonContainer(root, options)
  assignStyles(skeletonContainer, root, CopiedCssProperties)
  setupSkeletonContainer(skeletonContainer, options)

  const tree = walkWithMap<HTMLElement | Node, HTMLElement>(
    root,
    node => getChildNodes(node),
    (child, parent, mappedParent, withFlag) => {
      if (child.nodeType !== Node.ELEMENT_NODE || !(child instanceof HTMLElement)) {
        return SkipChildren
      }

      /**
       * mappedParent 为空时, 说明当前节点是根节点. 在 CSS 盒模型中, 子节点的最大宽度和高度被限制在父节点的内容区域内.
       * 而内容区域由 内容宽度/高度 + padding + border 决定, 永远不会包含 margin. 因此在根节点处不需要复制 margin 属性.
       */
      const copiedCssProperties = isNil(mappedParent) ? CopiedCssPropertiesWithoutMargin : CopiedCssProperties
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

      if (isBoneable(child, options.fuzzy)) { // 当前节点可以作为 bone 时, 创建一个 bone 元素返回并跳过剩余子节点.
        const skeletonNode = createSkeletonBone(child, options)
        assignStyles(skeletonNode, child, copiedCssProperties)
        setupSkeletonBone(skeletonNode, child, options)

        const rect = child.getBoundingClientRect()
        skeletonNode.style.setProperty('width', `${rect.width}px`)
        skeletonNode.style.setProperty('height', `${rect.height}px`)

        mappedParent?.appendChild(skeletonNode)

        return withFlag(skeletonNode, SkipChildren)
      }
      else { // 除此之外的普通 DOM 元素, 只是简单的克隆并拷贝样式.
        const regularNode = document.createElement(isCustomElement(child) ? 'div' : child.nodeName.toLowerCase())

        assignStyles(regularNode, child, copiedCssProperties)

        mappedParent?.appendChild(regularNode)

        return regularNode
      }
    },
  )

  if (isNil(tree)) {
    throw new Error('skeletonOverlayPlugin: tree is nil')
  }

  skeletonContainer.append(tree)

  return {
    name: 'skeleton-overlay',
    mount() {
      setupMountPoint(root)
      root.append(skeletonContainer)
    },
    unmount() {
      resetMountPoint(root)
      skeletonContainer.remove()
    },
  }
}
