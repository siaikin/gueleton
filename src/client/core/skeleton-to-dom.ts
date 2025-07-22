import type { Skeleton, SkeletonTreeNode } from '../../shared/types/skeleton'
import { isString, kebabCase } from 'lodash-es'

export function skeletonToDom(skeleton: Skeleton): Node {
  const rootNode = deepMapSkeleton(skeleton.tree, (node) => {
    const el = document.createElement(node.tag)

    for (const [key, value] of Object.entries(node.style)) {
      el.style.setProperty(kebabCase(key), value)
    }

    if (isString(node.className) && node.className.length > 0) {
      el.classList.add(...node.className.split(' '))
    }

    return el
  })

  return rootNode
}

function deepMapSkeleton(rootNode: SkeletonTreeNode, callbackFn: (skeleton: SkeletonTreeNode) => Element): Element {
  const root = callbackFn(rootNode)

  const cloneMap = new Map<SkeletonTreeNode, Element>()
  cloneMap.set(rootNode, root)

  const queue = [rootNode]

  while (queue.length) {
    const node = queue.shift()!

    const skeletonNode = cloneMap.get(node)!

    for (const child of node.children) {
      const skeletonChild = callbackFn(child)
      cloneMap.set(child, skeletonChild)

      skeletonNode.appendChild(skeletonChild)
      queue.push(child)
    }
  }

  return root
}
