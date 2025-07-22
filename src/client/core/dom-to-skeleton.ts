import type * as CSS from 'csstype'
import type { Skeleton, SkeletonOptions, SkeletonTreeNode } from '../../shared'
import { isArray } from 'lodash-es'
import { isBonableContainer, isBoneable } from './is-bone'
import { assignStyle, getChildNodes, isCustomElement, isEmptyTextNode } from './utils'

const copiedCssProperties: (keyof CSS.StandardPropertiesHyphen)[] = [
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
  ...['grid-template-columns', 'grid-template-rows', 'grid-template-areas', 'column-gap', 'row-gap', 'grid-column-start', 'grid-column-end', 'grid-row-start', 'grid-row-end', 'grid-auto-columns', 'grid-auto-rows', 'grid-auto-flow', 'grid-template'],
  // transform 相关属性
  ...['transform', 'transform-origin', 'transform-style', 'transform-box'],
] as const

export function domToSkeleton<CSSTYPE>(dom: Element, options: SkeletonOptions<CSSTYPE>): Skeleton {
  const tree = deepMapDom(dom, (node) => {
    const element = node as Element
    const nodeName = element.nodeName.toLowerCase()

    const skeletonNode: SkeletonTreeNode = {
      attrs: {},
      style: {},
      className: '',
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
          skeletonNode.style[key] = value as any
      }
    }

    if (isBoneable(node, options.depth)) {
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

      assignStyle(skeletonNode.style, options.bone.style)
      skeletonNode.className = isArray(options.bone.className) ? options.bone.className.join(' ') : options.bone.className
      // skeletonNode.style['border-radius'] = `${options.radius}px`
      // skeletonNode.style['background-color'] = options.color
      // skeletonNode.style['background-clip'] = 'content-box'
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
    root.style.zIndex = '10'
    // root.style.height = '100%';
    assignStyle(root.style, options.container.style)
    root.className = isArray(options.container.className) ? options.container.className.join(' ') : options.container.className
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

  if (isBoneable(domNode, options.depth)) {
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

      if (isBoneable(child, options.depth)) {
        // no need to traverse
      }
      else {
        queue.push(child)
      }
    }
  }

  return root
}
