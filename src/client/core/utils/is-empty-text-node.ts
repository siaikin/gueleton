export function isEmptyTextNode(node: Node): boolean {
  if (node.nodeType === Node.TEXT_NODE) {
    return !/\S/.test((node as Text).wholeText)
  }

  return false
}
