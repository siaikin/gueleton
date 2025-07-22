import type * as CSS from 'csstype'
import { kebabCase } from 'lodash-es'

export function assignStyle(target: CSS.StandardPropertiesHyphen, source: CSS.StandardProperties & CSS.StandardPropertiesHyphen): void {
  const keys = Object.keys(source) as (keyof (CSS.StandardProperties & CSS.StandardPropertiesHyphen))[]

  for (const key of keys) {
    const kebabCaseKey = kebabCase(key) as (keyof CSS.StandardPropertiesHyphen)

    target[kebabCaseKey] = source[key] as any
  }
}
