import type { CSSProperties, ReactNode } from 'react'
import type { GueletonOptions } from '../core'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Gueleton as GueletonCore } from '../core'
import { Slot } from './primitive/slot'

interface GueletonProps<T> extends GueletonOptions<T, CSSProperties> {
  children: (params: { data: T | null | undefined }) => ReactNode
}

// eslint-disable-next-line ts/explicit-function-return-type
export function Gueleton<T>({ children, dataKey, ...options }: GueletonProps<T>) {
  const containerRef = useRef<HTMLElement>(null)

  const [shouldRender, setShouldRender] = useState(false)
  const [renderData, setRenderData] = useState<T | null | undefined>(undefined)

  const gueleton = useMemo(() => {
    const instance = new GueletonCore(dataKey, options)
    instance.onOptionsUpdate = () => {
      setShouldRender(instance.shouldRender)
      setRenderData(instance.renderData)
    }
    return instance
  }, [dataKey])

  useEffect(() => gueleton.updateOptions(options, () => containerRef.current), [gueleton, options, containerRef])

  return (
    <Slot ref={containerRef}>
      {shouldRender && children({ data: renderData })}
    </Slot>
  )
}

export default Gueleton
