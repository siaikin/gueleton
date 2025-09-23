import type { SkeletonOptions } from '../../shared'
import { isArray, isNil, kebabCase } from 'lodash-es'
import { assignSkeletonStyle } from './utils'

export function createSkeletonContainer<CSSTYPE>(source: HTMLElement, _options: SkeletonOptions<CSSTYPE>): HTMLElement {
  const nodeName = source.nodeName.toLowerCase()
  const containerNode = document.createElement('div')
  containerNode.dataset.as = nodeName
  return containerNode
}

export function setupSkeletonContainer<CSSTYPE>(container: HTMLElement, options: SkeletonOptions<CSSTYPE>['container']): void {
  container.style.setProperty('display', 'block')
  container.style.setProperty('position', 'absolute')
  container.style.setProperty('top', '0')
  container.style.setProperty('left', '0')
  container.style.setProperty('width', '100%')
  container.style.setProperty('height', '100%')
  container.style.setProperty('margin', '0')
  container.style.setProperty('padding', '0')
  container.style.setProperty('overflow', 'hidden')
  container.style.setProperty('z-index', '10')

  for (const key of Object.keys(options.style || {})) {
    const value = options.style?.[key as keyof CSSTYPE]
    if (value) {
      container.style.setProperty(kebabCase(key), value.toString())
    }
  }

  const className = isArray(options.className) ? options.className.join(' ') : options.className
  className && container.classList.add(...className.split(' '))

  // container.dataset.gueletonBoneSkip = 'true'
}

export async function removeSkeletonContainer<CSSTYPE>(container: HTMLElement, options: SkeletonOptions<CSSTYPE>['bone']): Promise<void> {
  const { leave } = options

  if (typeof container.ontransitionrun === 'undefined' || isNil(leave)) {
    container.remove()
    return
  }

  let transitionruned = false
  container.addEventListener('transitionrun', () => transitionruned = true, { once: true })

  assignSkeletonStyle(container, leave)

  await new Promise(resolve => setTimeout(resolve, 50))

  if (transitionruned) {
    await new Promise<void>(resolve => container.addEventListener('transitionend', () => resolve(), { once: true }))
  }

  container.remove()
}
