import type { CSSProperties } from 'react'
import type { GueletonOptions } from '../core'
import type { BasicTarget } from './utils'
import { useEffect, useMemo, useState } from 'react'
import { Gueleton as GueletonCore } from '../core'
import { getTargetElement } from './utils'

export function useGueleton<T>(
  dataKey: GueletonOptions<T, CSSProperties>['dataKey'],
  container: BasicTarget,
  options: Omit<GueletonOptions<T, CSSProperties>, 'dataKey'>,
): [{ shouldRender: boolean, renderData: T | null | undefined }] {
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

  useEffect(() => gueleton.updateOptions(options, () => getTargetElement(container)), [gueleton, options, container])

  return [{ shouldRender, renderData }]
}
