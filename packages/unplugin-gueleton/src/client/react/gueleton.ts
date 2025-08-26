import type { CSSProperties, ReactNode } from 'react'
import type { GueletonOptions } from '../core'
import { useEffect, useMemo, useRef, useState } from 'react'
import { jsx } from 'react/jsx-runtime'
import { Gueleton as GueletonCore } from '../core'
import { Slot } from './primitive/slot'
import { useGueleton } from './use-gueleton'

interface GueletonProps<T> extends GueletonOptions<T, CSSProperties> {
  children: (params: { data: T | null | undefined }) => ReactNode
}

// eslint-disable-next-line ts/explicit-function-return-type
export function Gueleton<T>({ children, dataKey, ...options }: GueletonProps<T>) {
  const containerRef = useRef<HTMLElement>(null)

  const [gueleton] = useGueleton<T>(dataKey, containerRef, options)

  return /* @__PURE__ */ jsx(Slot, {
    ref: containerRef,
    children: gueleton.shouldRender && children({ data: gueleton.renderData }),
  })
}

export default Gueleton
