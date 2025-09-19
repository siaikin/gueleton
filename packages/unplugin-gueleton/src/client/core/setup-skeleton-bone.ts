import type { SkeletonOptions } from '../../shared'
import { isArray, kebabCase } from 'lodash-es'

export function createSkeletonBone<CSSTYPE>(source: HTMLElement, _options: SkeletonOptions<CSSTYPE>): HTMLElement {
  const nodeName = source.nodeName.toLowerCase()
  const boneNode = document.createElement('div')
  boneNode.dataset.as = nodeName
  return boneNode
}

export function setupSkeletonBone<CSSTYPE>(bone: HTMLElement, source: HTMLElement, options: SkeletonOptions<CSSTYPE>): void {
  const styleMap = source.computedStyleMap()

  for (const key of Object.keys(options.bone.style || {})) {
    const value = options.bone.style?.[key as keyof CSSTYPE]
    if (value) {
      bone.style.setProperty(kebabCase(key), value.toString())
    }
  }

  if (styleMap.get('display')?.toString() === 'inline') {
    bone.style.setProperty('display', 'inline-block')
  }

  const className = isArray(options.bone.className) ? options.bone.className.join(' ') : options.bone.className
  className && bone.classList.add(...className.split(' '))
}

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
