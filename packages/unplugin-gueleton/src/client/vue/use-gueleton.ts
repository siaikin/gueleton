import type { ComponentPublicInstance, ComputedRef, CSSProperties, MaybeRefOrGetter } from 'vue'
import type { GueletonOptions } from '../core'
import type { ToMaybeRefOrGetter } from './utils'
import { computed, shallowReactive, toValue, watch } from 'vue'
import { Gueleton } from '../core'
import { refOrGetterMapToRaw } from './utils'

export function useGueleton<T>(
  dataKey: MaybeRefOrGetter<GueletonOptions<T, CSSProperties>['dataKey']>,
  container: MaybeRefOrGetter<Element | ComponentPublicInstance | null | undefined>,
  options: ToMaybeRefOrGetter<Omit<GueletonOptions<T, CSSProperties>, 'dataKey'>> = {},
): {
  shouldRender: ComputedRef<boolean>
  renderData: ComputedRef<GueletonOptions<T, CSSProperties>['data']>
} {
  let gueleton: Gueleton<T, CSSProperties>
  watch(() => toValue(dataKey), _dataKey => gueleton = shallowReactive(new Gueleton(_dataKey, refOrGetterMapToRaw(options))), { immediate: true })

  const propRefs = Object.values(options)

  watch([...propRefs, () => toValue(container)], () => {
    gueleton.updateOptions(
      refOrGetterMapToRaw(options),
      () => {
        const _container = toValue(container)
        return _container instanceof Element ? _container : _container?.$el
      },
    )
  }, { immediate: true })

  return {
    shouldRender: computed(() => gueleton.shouldRender),
    renderData: computed(() => gueleton.renderData),
  }
}
