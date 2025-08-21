import { isNil } from 'lodash-es'

export function isCustomElement(node: Node): boolean {
  return node.nodeType === Node.ELEMENT_NODE && !isNil(customElements.get(node.nodeName.toLowerCase()))
}
