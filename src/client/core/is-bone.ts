import { getChildNodes, isEmptyTextNode, walk } from './utils'

/**
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements#text_content
 */
const boneableTags = [
  ...['area', 'audio', 'img', 'track', 'video'],
  ...['embed', 'fencedframe', 'iframe', 'object'],
  ...['svg'],
  ...['canvas'],
  // Forms
  ...['button', 'input', 'meter', 'progress', 'select', 'textarea'],
]

const inlineTags = [
  ...['a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'code', 'data', 'dfn', 'em', 'i', 'kbd', 'mark', 'q', 'rb', 'rp', 'rt', 'rtc', 's', 'samp', 'small', 'span', 'strong', 'sub', 'sup', 'time', 'u', 'var', 'wbr'],
]

/**
 * 判断节点是否可作为骨骼节点. 在骨架中, 骨骼节点将具有宽高和背景颜色.
 *
 * 骨骼节点是满足下列任意条件的 DOM 元素:
 * - 自身是 {@link inlineTags} 或 {@link boneableTags} 中列出的元素, 且面积大于等于 32
 * - 子节点中包含非空文本节点
 * - 子节点中包含 {@link inlineTags} 或 {@link boneableTags} 中列出的元素, 且面积大于等于 32
 * - 自身存在 `data-gueleton-bone` 属性
 *
 * 根据 depth 参数, 上述条件中的子节点也会被递归判断.
 */
export function isBoneable(node: Node, depth: number = 1): boolean {
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return false
  }

  {
    const element = node as HTMLElement
    if (Object.hasOwn(element.dataset, 'gueletonBone')) {
      return true
    }
  }

  let result = false
  walk(
    node,
    node => getChildNodes(node),
    (child) => {
      if (child.nodeType === Node.TEXT_NODE && !isEmptyTextNode(child)) {
        result = true
        return true
      }

      if (child.nodeType === Node.ELEMENT_NODE) {
        const tagName = (child as Element).tagName.toLowerCase()
        const bbox = (child as Element).getBoundingClientRect()
        const isHaveSize = bbox.width * bbox.height >= 32

        if (
          (inlineTags.includes(tagName) || boneableTags.includes(tagName))
          && isHaveSize
        ) {
          result = true
          return true
        }
      }
    },
    { depth },
  )

  if (depth === 0) {
    for (const child of getChildNodes(node)) {
      if (child.nodeType === Node.TEXT_NODE && !isEmptyTextNode(child)) {
        result = true
        break
      }
    }
  }

  return result
}

export function isBonableContainer(node: Node): boolean {
  if (node.nodeType !== Node.ELEMENT_NODE)
    return false

  const children = getChildNodes(node)
  return children.some(child => child.nodeType === Node.ELEMENT_NODE)
}
