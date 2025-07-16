import type { SkeletonOptions } from '../../shared'
import type { Skeleton, SkeletonTreeNode } from '../../shared/types/skeleton'
import { merge } from 'lodash-es'
import { DefaultSkeletonOptions } from '../../shared'
import { isBonableContainer, isBoneable } from './is-bone'
import { getChildNodes, isCustomElement, isEmptyTextNode } from './utils'

const copiedCssProperties: string[] = [
  // position
  ...['position', 'z-index', 'top', 'left', 'right', 'bottom'],
  'text-align',
  'display',
  ...['width', 'max-width', 'min-width'],
  ...['height', 'max-height', 'min-height'],
  ...['padding-top', 'padding-right', 'padding-bottom', 'padding-left'],
  ...['margin-top', 'margin-right', 'margin-bottom', 'margin-left'],
  // flex 布局
  ...['flex-direction', 'align-items', 'justify-content', 'flex-wrap', 'gap', 'flex', 'flex-shrink', 'flex-grow', 'flex-basis', 'flex-flow', 'align-content', 'align-self'],
  // grid 布局
  ...['grid-template-columns', 'grid-template-rows', 'grid-template-areas', 'grid-column-gap', 'grid-row-gap', 'grid-gap', 'grid-column-start', 'grid-column-end', 'grid-row-start', 'grid-row-end', 'grid-auto-columns', 'grid-auto-rows', 'grid-auto-flow', 'grid-template'],
]

export function domToSkeleton(dom: Element, _options: Partial<SkeletonOptions> = {}): Skeleton {
  const options = merge({}, DefaultSkeletonOptions, _options)

  const tree = deepMapDom(dom, (node) => {
    const element = node as Element
    const nodeName = element.nodeName.toLowerCase()

    const skeletonNode: SkeletonTreeNode = {
      attrs: {},
      style: {},
      tag: isCustomElement(node) ? 'div' : nodeName,
      children: [],
    }

    const styleMap = element.computedStyleMap()
    for (const key of copiedCssProperties) {
      const value = styleMap.get(key)?.toString() ?? ''
      switch (key) {
        case 'display':
          skeletonNode.style[key] = value === 'inline' ? 'inline-block' : value
          break
        default:
          skeletonNode.style[key] = value
      }
    }

    if (isBoneable(node, options.quality)) {
      switch (nodeName) {
        case 'img':
        case 'video':
        case 'input':
        case 'button':
          skeletonNode.tag = 'div'
          skeletonNode.attrs.as = nodeName
          break
      }

      const rect = element.getBoundingClientRect()
      skeletonNode.style.width = `${rect.width}px`
      skeletonNode.style.height = `${rect.height}px`
      skeletonNode.style['border-radius'] = `${options.radius}px`
      skeletonNode.style['background-color'] = options.color
      skeletonNode.style['background-clip'] = 'content-box'
    }

    return skeletonNode
  }, options)

  // 根节点作为容器需要特定的样式支撑
  {
    const rootElement = dom as HTMLElement
    const styleMap = rootElement.computedStyleMap()
    if (styleMap.get('position')?.toString() === 'static') {
      rootElement.style.position = 'relative'
    }

    const root = tree
    root.style.position = 'absolute'
    root.style.top = '0'
    root.style.left = '0'
    root.style.width = '100%'
    root.style.margin = '0'
    // root.style.height = '100%';
    root.style['background-color'] = options.backgroundColor
    root.style['z-index'] = '10'
  }

  return {
    id: '',
    tree,
  }
}

function deepMapDom(domNode: Node, callbackFn: (node: Node) => SkeletonTreeNode, options: SkeletonOptions): SkeletonTreeNode {
  const cloneMap = new Map<Node, SkeletonTreeNode>()

  const root = callbackFn(domNode)
  cloneMap.set(domNode, root)

  if (!isBonableContainer(domNode)) {
    return root
  }

  const queue = []

  if (isBoneable(domNode, options.quality)) {
    return root
  }
  else {
    queue.push(domNode)
  }

  while (queue.length) {
    const node = queue.shift()!

    const skeletonNode = cloneMap.get(node)!

    const children = getChildNodes(node)
    for (const child of children) {
      if (child.nodeType !== Node.TEXT_NODE && child.nodeType !== Node.ELEMENT_NODE)
        continue

      if (isEmptyTextNode(child)) {
        continue
      }

      if (!(child as Element).checkVisibility({
        contentVisibilityAuto: true,
        opacityProperty: true,
        visibilityProperty: true,
      })) {
        continue
      }

      const skeletonChild = callbackFn(child)
      cloneMap.set(child, skeletonChild)

      skeletonNode.children.push(skeletonChild)

      if (isBoneable(child, options.quality)) {
        // no need to traverse
      }
      else {
        queue.push(child)
      }
    }
  }

  return root
}
