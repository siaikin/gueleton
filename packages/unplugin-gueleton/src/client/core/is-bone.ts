import { Tags } from './constants'
import { EarlyReturn, getChildNodes, isEmptyTextNode, walk } from './utils'

/**
 * 判断节点是否可作为骨骼节点. 在骨架中, 骨骼节点将具有宽高和背景颜色.
 *
 * 骨骼节点是满足下列任意条件的 DOM 元素:
 * - 自身是 {@link Tags.Boneable} 中列出的元素, 且面积大于等于 16
 * - 子节点中包含非空文本节点
 * - 自身存在 `data-gueleton-bone` 属性
 *
 * 自身存在 `data-gueleton-bone-skip` 属性时, 将跳过该节点以及子节点.
 *
 * 根据 fuzzy 参数, 上述条件中的子节点也会被递归判断.
 */
export function isBoneable(node: Node, fuzzy: number = 1): boolean {
  // fuzzy = Math.max(fuzzy, 1)

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return false
  }

  // dataset
  {
    const element = node as HTMLElement

    if (Object.hasOwn(element.dataset, 'gueletonBoneSkip')) {
      return false
    }

    if (Object.hasOwn(element.dataset, 'gueletonBone')) {
      return true
    }
  }

  if (checkElementBonable(node, Tags.Boneable)) {
    return true
  }

  let result = false
  walk(
    node,
    node => getChildNodes(node),
    (child) => {
      if (child.nodeType === Node.TEXT_NODE && !isEmptyTextNode(child)) {
        result = true
        return EarlyReturn
      }

      if (checkElementBonable(child, Tags.Void)) {
        result = true
        return EarlyReturn
      }
    },
    { depth: fuzzy },
  )

  // if (fuzzy === 0) {
  //   for (const child of getChildNodes(node)) {
  //     if (child.nodeType === Node.TEXT_NODE && !isEmptyTextNode(child)) {
  //       result = true
  //       break
  //     }
  //   }
  // }

  return result
}

function checkElementBonable(node: Node, tags: string[]): boolean {
  if (node.nodeType !== Node.ELEMENT_NODE || !(node instanceof HTMLElement)) {
    return false
  }

  const tagName = node.tagName.toLowerCase()
  const bbox = node.getBoundingClientRect()
  const isHaveSize = bbox.width * bbox.height >= 16
  const isVisible = node.checkVisibility({ contentVisibilityAuto: true, opacityProperty: true, visibilityProperty: true })

  return tags.includes(tagName) && isHaveSize && isVisible
}

export function isBonableContainer(node: Node): boolean {
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return false
  }

  const children = getChildNodes(node)
  return children.some(child => child.nodeType === Node.ELEMENT_NODE)
}
