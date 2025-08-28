import type { ComponentPublicInstance, ComputedRef, CSSProperties, MaybeRefOrGetter } from 'vue'
import type { GueletonOptions } from '../core'
import type { ToMaybeRefOrGetter } from './utils'
import { readonly, ref, shallowReactive, toValue, watch } from 'vue'
import { Gueleton } from '../core'
import { refOrGetterMapToRaw } from './utils'
import { isNil } from 'lodash-es'

export function useGueleton<T>(
  dataKey: MaybeRefOrGetter<GueletonOptions<T, CSSProperties>['dataKey']>,
  container: MaybeRefOrGetter<Element | ComponentPublicInstance | null | undefined>,
  options: ToMaybeRefOrGetter<Omit<GueletonOptions<T, CSSProperties>, 'dataKey'>> = {},
): {
  shouldRender: ComputedRef<boolean>
  renderData: ComputedRef<GueletonOptions<T, CSSProperties>['data']>
} {
  const shouldRender = ref(false)
  const renderData = ref<GueletonOptions<T, CSSProperties>['data']>(undefined)

  let gueleton: Gueleton<T, CSSProperties>
  watch(() => toValue(dataKey), (_dataKey) => {
    gueleton = shallowReactive(new Gueleton(_dataKey, refOrGetterMapToRaw(options)))
    gueleton.onOptionsUpdate = () => {
      shouldRender.value = gueleton.shouldRender
      renderData.value = gueleton.renderData
    }
  }, { immediate: true })

  const propRefs = Object.values(options)

  watch([...propRefs, () => toValue(container)], () => {
    gueleton.updateOptions(
      refOrGetterMapToRaw(options),
      () => {
        const _container = toValue(container)

        if (isNil(_container)) {
          return null
        }

        return _container instanceof Element ? _container : _container?.$el
      },
    )
  }, { immediate: true })

  return {
    shouldRender: readonly(shouldRender),
    renderData: readonly(renderData),
  }
}
