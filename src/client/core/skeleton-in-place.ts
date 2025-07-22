import type { SkeletonOptions } from '../../shared'
import { isArray, kebabCase } from 'lodash-es'
import { isBoneable } from './is-bone'
import { getChildNodes, walk } from './utils'

export function skeletonInPlace<CSSTYPE>(dom: Element, options: SkeletonOptions<CSSTYPE>): {
  detachBone: () => void
  attachBone: () => void
} {
  const bones = new Map<HTMLElement, HTMLElement>()

  function attachBone(): void {
    walk(
      dom as Node,
      node => getChildNodes(node),
      (child) => {
        if (!isBoneable(child, options.depth)) {
          return
        }

        const boneNode = createBone(child as HTMLElement)
        bones.set(child as HTMLElement, boneNode)
        child.appendChild(boneNode)
      },
    )
  }

  function detachBone(): void {
    for (const [child, bone] of bones) {
      const originPosition = child.dataset.position
      if (originPosition) {
        child.style.setProperty('position', originPosition)
      }
      bone.remove()
    }
  }

  function createBone(el: HTMLElement): HTMLElement {
        const styleMap = el.computedStyleMap()
        const position = styleMap.get('position')?.toString()
        if (position === 'static') {
          el.style.setProperty('position', 'relative')
          el.dataset.position = position
        }

        const boneContainer = document.createElement(el.nodeName.toLowerCase())

        boneContainer.style.setProperty('display', 'block', 'important')
        boneContainer.style.setProperty('position', 'absolute', 'important')
        boneContainer.style.setProperty('top', '0', 'important')
        boneContainer.style.setProperty('left', '0', 'important')
        boneContainer.style.setProperty('width', '100%', 'important')
        boneContainer.style.setProperty('height', '100%', 'important')
        boneContainer.style.setProperty('margin', '0', 'important')
        boneContainer.style.setProperty('zIndex', '10', 'important')
        for (const key of Object.keys(options.container.style)) {
        // eslint-disable-next-line ts/ban-ts-comment
        // @ts-expect-error
          boneContainer.style.setProperty(kebabCase(key), options.container.style[key])
        }

        boneContainer.className = isArray(options.container.className) ? options.container.className.join(' ') : options.container.className

        const boneNode = document.createElement('div')

        boneNode.style.setProperty('display', 'block', 'important')
        boneNode.style.setProperty('width', '100%', 'important')
        boneNode.style.setProperty('height', '100%', 'important')
        for (const key of Object.keys(options.bone.style)) {
        // eslint-disable-next-line ts/ban-ts-comment
        // @ts-expect-error
          boneNode.style.setProperty(kebabCase(key), options.bone.style[key])
        }

        boneNode.className = isArray(options.bone.className) ? options.bone.className.join(' ') : options.bone.className
        boneContainer.appendChild(boneNode)

        return boneContainer
  }

  return {
    attachBone,
    detachBone,
  }
}
