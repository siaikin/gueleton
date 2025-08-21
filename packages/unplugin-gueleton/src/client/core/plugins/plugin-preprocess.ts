import type { SkeletonOptions, SkeletonPlugin } from '../../../shared'
import { getChildNodes, isEmptyTextNode, walk } from '../utils'

export function preprocessPlugin<CSSTYPE>(root: HTMLElement, _options: SkeletonOptions<CSSTYPE>): SkeletonPlugin {
  const textNodes = new Map<Node, HTMLSpanElement>()

  walk<HTMLElement | Node>(
    root,
    node => getChildNodes(node),
    (child) => {
      if (child.nodeType !== Node.TEXT_NODE || isEmptyTextNode(child)) {
        return
      }

      const spanEl = document.createElement('span')
      spanEl.dataset.gueletonBone = 'true'
      spanEl.style.setProperty('display', 'inline-block')
      spanEl.style.setProperty('vertical-align', 'middle')
      textNodes.set(child, spanEl)
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
