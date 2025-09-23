import type { SkeletonOptions } from '../../shared'
import { isNil } from 'lodash-es'
import { assignSkeletonStyle } from './utils'

export function createSkeletonBone<CSSTYPE>(source: HTMLElement, _options: SkeletonOptions<CSSTYPE>): HTMLElement {
  const nodeName = source.nodeName.toLowerCase()
  const boneNode = document.createElement('div')
  boneNode.dataset.as = nodeName
  /**
   * 确保骨架屏元素有内容，从而使其在某些情况下（如行内元素）能够正确显示。
   */
  boneNode.innerHTML = '&nbsp;'
  return boneNode
}

export function setupSkeletonBone<CSSTYPE>(bone: HTMLElement, source: HTMLElement, options: SkeletonOptions<CSSTYPE>['bone']): void {
  assignSkeletonStyle(bone, options)

  if (globalThis.getComputedStyle(source).getPropertyValue('display')?.toString() === 'inline') {
    bone.style.setProperty('display', 'inline-block')
  }
}

export async function removeSkeletonBone<CSSTYPE>(bone: HTMLElement, options: SkeletonOptions<CSSTYPE>['bone']): Promise<void> {
  const { leave } = options

  if (typeof bone.ontransitionrun === 'undefined' || isNil(leave)) {
    bone.remove()
    return
  }

  let transitionruned = false
  bone.addEventListener('transitionrun', () => transitionruned = true, { once: true })

  assignSkeletonStyle(bone, leave)

  await Promise.resolve()

  if (transitionruned) {
    bone.addEventListener('transitionend', () => bone.remove(), { once: true })
  }
  else {
    bone.remove()
  }
}
