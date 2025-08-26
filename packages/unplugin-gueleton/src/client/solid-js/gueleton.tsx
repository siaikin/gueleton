import type { StandardProperties } from 'csstype'
import type { GueletonOptions } from '../core'
import { createEffect, createMemo, createSignal, untrack } from 'solid-js'
import { createComponent, memo } from 'solid-js/web'
import { Gueleton as GueletonCore } from '../core'
import { Slot } from './primitive/slot'

interface GueletonProps<T> extends GueletonOptions<T, StandardProperties> {
  children: (params: { data: T | null | undefined }) => any
}

// eslint-disable-next-line ts/explicit-function-return-type
export function Gueleton<T>(props: GueletonProps<T>) {
  const [containerRef, setContainerRef] = createSignal<HTMLElement>()
  const [shouldRender, setShouldRender] = createSignal(false)
  const [renderData, setRenderData] = createSignal<T | null | undefined>(undefined)

  const gueleton = createMemo(() => {
    const _dataKey = props.dataKey
    const instance = untrack(() => new GueletonCore(_dataKey, props))
    instance.onOptionsUpdate = () => {
      setShouldRender(instance.shouldRender)
      setRenderData(() => instance.renderData)
    }
    return instance
  })

  createEffect(() => gueleton().updateOptions(props, () => containerRef()))

  return createComponent(Slot, {
    ref: setContainerRef,
    get children() {
      return memo(() => !!shouldRender())() && props.children({
        data: renderData(),
      })
    },
  })
  return (
    <Slot ref={setContainerRef}>
      {shouldRender() && props.children({ data: renderData() })}
    </Slot>
  )
}
