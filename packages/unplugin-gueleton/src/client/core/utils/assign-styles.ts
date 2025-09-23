import type { SkeletonStyleOptions } from '../options'
import { isArray, kebabCase } from 'lodash-es'

export function assignStyles<CSSTYPE>(target: HTMLElement, source: HTMLElement, properties: (keyof CSSTYPE)[]): void {
  const styles = globalThis.getComputedStyle(source)
  const rectBox = source.getBoundingClientRect()

  for (const key of properties) {
    const _key = kebabCase(key as string)

    switch (_key) {
      /**
       * 对于 width 和 height, 在一些情况下元素不会严格按照设置的值来渲染, 例如:
       * - flex 布局中, 元素的宽高作为 flex 项可能会被调整.
       * - 元素的 box-sizing 为 border-box 时, width 和 height 包含了 padding 和 border 的值.
       * - 元素的 display 为 inline 时, height 无效.
       *
       * 因此我们直接使用 getBoundingClientRect 获取的值来设置宽高, 以确保骨架屏的尺寸与原始元素一致.
       */
      case 'width':
      case 'height': {
        target.style.setProperty(_key, `${rectBox[_key]}px`)
        break
      }
      default: {
        target.style.setProperty(_key, styles.getPropertyValue(_key)?.toString() ?? '')
        break
      }
    }
  }
}

export function assignSkeletonStyle<CSSTYPE>(target: HTMLElement, options: Partial<SkeletonStyleOptions<CSSTYPE>>): void {
  for (const key of Object.keys(options.style || {})) {
    const value = options.style?.[key as keyof CSSTYPE]
    if (value) {
      target.style.setProperty(kebabCase(key), value.toString())
    }
  }

  const className = isArray(options.className) ? options.className.join(' ') : options.className
  if (className) {
    target.classList.add(...className.split(' '))
  }
}
