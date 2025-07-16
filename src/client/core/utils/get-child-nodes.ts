export function getChildNodes(node: Node): Node[] {
  const el = node as Element
  const children = Array.from((el.shadowRoot ?? el).childNodes)

  const result: Node[] = []
  for (const child of children) {
    const nodeName = child.nodeName.toLowerCase()

    if (nodeName === 'slot') {
      const children: Node[] = (child as HTMLSlotElement).assignedNodes()
      /**
       * 如果分配给 slot 的节点为空, 则使用 slot 的回退内容.
       *
       * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_templates_and_slots#adding_flexibility_with_slots
       * > If the slot's content isn't defined when the element is included in the markup, or if the browser doesn't support slots, <my-paragraph> just contains the fallback content "My default text".
       */
      result.push(...(children.length > 0 ? children : Array.from(node.childNodes)))
    }
    else {
      result.push(child)
    }
  }

  return result
}
