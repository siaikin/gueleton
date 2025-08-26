import { isFunction } from 'lodash-es'
import type { RefObject } from 'react'

import { useEffect, useState } from 'react'

export function useMounted(): boolean {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  return isMounted
}

/**
 * @see https://github.com/alibaba/hooks/blob/c2373d8b8102df6976db716a1c4639cb737c9588/packages/hooks/src/utils/isBrowser.ts
 */
const isBrowser = !!(
  typeof window !== 'undefined'
  && window.document
  && window.document.createElement
)

/**
 * @see https://github.com/alibaba/hooks/blob/c2373d8b8102df6976db716a1c4639cb737c9588/packages/hooks/src/utils/domTarget.ts
 */
type TargetValue<T> = T | undefined | null

type TargetType = HTMLElement | Element | Window | Document

export type BasicTarget<T extends TargetType = Element>
  = | (() => TargetValue<T>)
    | TargetValue<T>
    | RefObject<TargetValue<T>>

// eslint-disable-next-line ts/explicit-function-return-type
export function getTargetElement<T extends TargetType>(target: BasicTarget<T>, defaultElement?: T) {
  if (!isBrowser) {
    return undefined
  }

  if (!target) {
    return defaultElement
  }

  let targetElement: TargetValue<T>

  if (isFunction(target)) {
    targetElement = target()
  }
  else if ('current' in target) {
    targetElement = target.current
  }
  else {
    targetElement = target
  }

  return targetElement
}
