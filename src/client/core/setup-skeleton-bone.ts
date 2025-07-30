import { isArray, kebabCase } from "lodash-es"
import { SkeletonOptions } from "../../shared"

export function createSkeletonBone<CSSTYPE>(source: HTMLElement, options: SkeletonOptions<CSSTYPE>): HTMLElement {
  const nodeName = source.nodeName.toLowerCase()
  const boneNode = document.createElement('div')
  boneNode.dataset.as = nodeName
  return boneNode
}

export function setupSkeletonBone<CSSTYPE>(bone: HTMLElement, source: HTMLElement, options: SkeletonOptions<CSSTYPE>) {
  const styleMap = source.computedStyleMap()

  for (const key of Object.keys(options.bone.style || {})) {
    const value = options.bone.style[key as keyof CSSTYPE]
    if (value) {
      bone.style.setProperty(kebabCase(key), value.toString())
    }
  }

  if (styleMap.get('display')?.toString() === 'inline') {
    bone.style.setProperty('display', 'inline-block')
  }


  const className = isArray(options.bone.className) ? options.bone.className.join(' ') : options.bone.className
  className.length > 0 && bone.classList.add(...className.split(' '))

  // boneNode.dataset.gueletonBoneSkip = 'true'
}

export function createSkeletonContainer<CSSTYPE>(source: HTMLElement, options: SkeletonOptions<CSSTYPE>): HTMLElement {
  const nodeName = source.nodeName.toLowerCase()
  const containerNode = document.createElement('div')
  containerNode.dataset.as = nodeName
  return containerNode
}

export function setupSkeletonContainer<CSSTYPE>(container: HTMLElement, options: SkeletonOptions<CSSTYPE>) {
  for (const key of Object.keys(options.container.style || {})) {
    const value = options.container.style[key as keyof CSSTYPE]
    if (value) {
      container.style.setProperty(kebabCase(key), value.toString())
    }
  }
  container.style.setProperty('display', 'block', 'important')
  container.style.setProperty('position', 'absolute', 'important')
  container.style.setProperty('top', '0', 'important')
  container.style.setProperty('left', '0', 'important')
  container.style.setProperty('width', '100%', 'important')
  container.style.setProperty('height', '100%', 'important')
  container.style.setProperty('margin', '0', 'important')
  container.style.setProperty('z-index', '10', 'important')

  const className = isArray(options.container.className) ? options.container.className.join(' ') : options.container.className
  className.length > 0 && container.classList.add(...className.split(' '))

  // container.dataset.gueletonBoneSkip = 'true'
}

