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
 * 判断节点是否可作为骨骼节点.
 * 在骨架中, 骨骼节点将具有宽高和背景颜色.
 */
export function isBoneable(node: Node, depth: number = 1): boolean {
  if (node.nodeType !== Node.ELEMENT_NODE)
    return false

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
