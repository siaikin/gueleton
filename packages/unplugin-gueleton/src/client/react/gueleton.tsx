import type { CSSProperties } from 'react'
import type { ComponentProps } from '../core'
import type { Primitive } from './primitive'
import { isNil, isUndefined, merge } from 'lodash-es'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Provider, prune, skeleton } from '../core'
import { Slot } from './primitive/slot'
import { useMounted } from './utils'

type GueletonProps<DATA> = ComponentProps<DATA, CSSProperties> & React.ComponentPropsWithoutRef<typeof Primitive.div> & {
  children?: (params: { data: DATA | null | undefined }) => React.ReactNode
}

// eslint-disable-next-line ts/explicit-function-return-type
export function Gueleton<T>(props: GueletonProps<T>) {
  const {
    data,
    dataKey,
    loading = false,
    forceRender = false,
    prestoreData: prestoreDataProp,
    children,
    asChild,
    ...restProps
  } = props

  const containerRef = useRef<HTMLElement>(null)
  const [prestoreData, setPrestoreData] = useState<T | null | undefined>(undefined)
  const [prestoreDataResolved, setPrestoreDataResolved] = useState(false)
  const isMounted = useMounted()

  const options = useMemo(() => merge({}, Provider.options, props), [props])

  // 处理 prestore data
  useEffect(() => {
    const loadPrestoreData = async (): Promise<void> => {
      if (isUndefined(prestoreDataProp)) {
        const data = await Provider.getPrestoreData<T>(dataKey)
        setPrestoreData(data)
        setPrestoreDataResolved(true)
      }
      else {
        setPrestoreData(prestoreDataProp)
      }
    }

    loadPrestoreData()
  }, [dataKey, prestoreDataProp])

  // 保存数据到 prestore
  useEffect(() => {
    if (!prestoreDataResolved || !isUndefined(prestoreData) || isUndefined(data) || loading) {
      return
    }

    const savePrestoreData = async (): Promise<void> => {
      await Provider.setPrestoreData(dataKey, prune(data, options.limit))
      setPrestoreData(await Provider.getPrestoreData<T>(dataKey))
    }

    savePrestoreData()
  }, [prestoreDataResolved, loading, dataKey, data, prestoreData, options.limit])

  useEffect(() => {
    if (isNil(containerRef.current) || !isMounted || !loading) {
      return
    }

    const unmount = skeleton(containerRef.current, { ...options })
    return () => unmount()
  }, [isMounted, loading, options, prestoreData])

  const renderContent = useCallback(() => {
    if (loading) {
      if (!isUndefined(prestoreData) || forceRender) {
        return children?.({ data: prestoreData })
      }
      return null
    }
    else {
      return children?.({ data })
    }
  }, [loading, prestoreData, forceRender, children, data])

  return (
    <Slot
      ref={containerRef}
      {...restProps}
    >
      {renderContent()}
    </Slot>
  )
}

export default Gueleton
