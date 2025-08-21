export function isEmptyTextNode(node: Node): boolean {
  if (node.nodeType !== Node.TEXT_NODE) {
    return false
  }

  return !/\S/.test(node.textContent ?? '')
}
