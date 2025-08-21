import { kebabCase } from 'lodash-es'

export function assignStyles<CSSTYPE>(target: HTMLElement, source: HTMLElement, properties: (keyof CSSTYPE)[]): void {
  const sourceStyleMap = source.computedStyleMap()
  for (const key of properties) {
    const _key = kebabCase(key as string)
    target.style.setProperty(_key, sourceStyleMap.get(_key)?.toString() ?? '')
  }
}
