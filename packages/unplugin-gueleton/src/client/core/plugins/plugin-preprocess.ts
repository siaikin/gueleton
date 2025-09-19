import type { SkeletonOptions, SkeletonPlugin } from '../../../shared'
import { isNil } from 'lodash-es'
import { getChildNodes, isEmptyTextNode, walk } from '../utils'

const excludeTags = ['th', 'td']

/**
 * 预处理插件
 *
 * 1. 将文本节点包裹在 <span> 元素中.
 *    这种方式可以从文本节点获得更细粒度的 bone 节点.
 */
export function preprocessPlugin<CSSTYPE>(root: HTMLElement, _options: SkeletonOptions<CSSTYPE>): SkeletonPlugin {
  const textNodes = new Map<Node, HTMLSpanElement>()

  walk<HTMLElement | Node>(
    root,
    node => getChildNodes(node),
    (child, parent) => {
      if (isNil(parent)) {
        return
      }

      if (child.nodeType !== Node.TEXT_NODE || isEmptyTextNode(child)) {
        return
      }

      const parentTagName = parent instanceof HTMLElement ? parent.tagName.toLowerCase() : ''

      if (excludeTags.includes(parentTagName) || parent.childNodes.length > 1) {
        const spanEl = document.createElement('span')
        spanEl.dataset.gueletonBone = 'true'
        // spanEl.style.setProperty('display', 'inline-block')
        // spanEl.style.setProperty('vertical-align', 'middle')
        textNodes.set(child, spanEl)
      }
    },
  )

  return {
    name: 'preprocess',
    mount() {
      for (const [textNode, spanEl] of textNodes) {
        textNode.parentNode?.replaceChild(spanEl, textNode)
        spanEl.appendChild(textNode)
      }
    },
    unmount() {
      for (const [textNode, spanEl] of textNodes) {
        spanEl.parentNode?.replaceChild(textNode, spanEl)
        spanEl.remove()
      }
    },
  }
}
