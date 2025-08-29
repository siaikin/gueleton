import type {
  ComponentPublicInstance,
  ComputedRef,
  DeepReadonly,
  MaybeRefOrGetter,
  Ref,
} from 'vue'
import type { GueletonOptions, PublicGueletonOptions } from '../core'
import type { ToMaybeRefOrGetter } from './utils'
import { isNil } from 'lodash-es'
import { computed, onMounted, readonly, ref, shallowReactive, toValue, watch } from 'vue'
import { Gueleton, GueletonProvider } from '../core'

export function useGueleton<T>(
  dataKey: MaybeRefOrGetter<PublicGueletonOptions<T>['dataKey']>,
  container: MaybeRefOrGetter<Element | ComponentPublicInstance | undefined>,
  options: ToMaybeRefOrGetter<Omit<PublicGueletonOptions<T>, 'dataKey'>> = {},
): {
  render: ComputedRef<boolean>
  data: ComputedRef<GueletonOptions<T>['data']>
} {
  let gueleton: Gueleton<T>
  watch(() => toValue(dataKey), async (_dataKey) => {
    // reactive 仅对外部的嗲用 实现相应时
    gueleton = shallowReactive(new Gueleton<T>(_dataKey, toValue(options.prestoreData)))
    await gueleton.resolvePrestoreData()
  }, { immediate: true })

  const { loading, data, limit, skeleton } = options

  /**
   * 当 prestoreData 为空时, 会根据 data 和 limit 生成预存数据, 并发送到 devServer
   */
  watch(
    [
      () => toValue(dataKey),
      () => gueleton.prestoreDataResolved,
      () => gueleton.prestoreData,
      () => toValue(loading),
      () => toValue(data),
    ] as const,
    async ([_dataKey, _resolved, _prestoreData, _loading, _data]) => {
      if (!_resolved || !isNil(_prestoreData) || isNil(_data) || _loading) {
        return
      }

      await gueleton.setupPrestoreData(_data, toValue(limit))
    },
  )

  watch(
    [
      () => toValue(container),
      useMounted(),
      () => toValue(loading),
      () => toValue(skeleton),
      () => gueleton.prestoreData,
    ] as const,
    async ([_container, _isMounted, _loading, _options, _prestoreData], _, onCleanup) => {
      if (isNil(_container) || !_isMounted || !_loading) {
        return
      }

      const _el = _container instanceof Element ? _container : _container.$el
      if (isNil(_el)) {
        return
      }

      gueleton.mount(_el, _options)
      onCleanup(() => gueleton.unmount())
    },
    { immediate: true, flush: 'post' },
  )

  const forceRender = computed(() => toValue(options.forceRender) ?? GueletonProvider.options.forceRender)
  const shouldRender = computed(() => {
    if (toValue(loading)) {
      return !isNil(gueleton.prestoreData) || toValue(forceRender)
    }
    return true
  })
  const renderData = computed(() => {
    return toValue(loading) ? gueleton.prestoreData : toValue(options.data)
  })

  return {
    render: shouldRender,
    data: renderData,
  }
}

function useMounted(): DeepReadonly<Ref<boolean>> {
  const isMounted = ref(false)
  onMounted(() => isMounted.value = true)
  return readonly(isMounted)
}
