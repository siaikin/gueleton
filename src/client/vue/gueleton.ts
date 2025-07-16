import type { ComponentPublicInstance, SetupContext, SlotsType } from 'vue'
import type { GueletonProviderKeyType } from './gueleton-provider'
import { isEmpty, isNil } from 'lodash-es'
import { computed, defineComponent, h, inject, onMounted, ref, toRefs, watch } from 'vue'
import { domToSkeleton, skeletonToDom } from '../core'
import { createContextNotFoundError } from '../core/utils'
import { GueletonProviderKey } from './gueleton-provider'

interface ComponentProps<DATA> {
  id: string
  data: DATA
  limit?: number
  as?: string
  loading?: boolean
}

interface Events extends Record<string, any[]> {
}

interface ComponentSlots<DATA> {
  default?: (params: { data: DATA }) => any
}

// eslint-disable-next-line style/spaced-comment
export const Gueleton = /*#__PURE__*/ defineComponent(
  <T extends object>(props: ComponentProps<T>, { slots, attrs }: SetupContext<Events, SlotsType<ComponentSlots<T>>>) => {
    const provider = inject<GueletonProviderKeyType<T>>(GueletonProviderKey)
    if (isNil(provider)) {
      throw createContextNotFoundError(GueletonProviderKey, 'GueletonProvider')
    }

    const { getPrestoreData, setPrestoreData } = provider

    const { id, data } = toRefs(props)
    const loading = computed(() => isNil(props.loading) ? false : props.loading)
    const limit = computed(() => props.limit ?? undefined)

    watch([data, limit], ([_data, _limit]) => {
      if (isEmpty(_data)) {
        return
      }

      const cutedData = (_data as Array<any>).slice(0, _limit)
      setPrestoreData(id.value, cutedData as T)
    })

    const presotreData = getPrestoreData(id.value)

    const isMounted = ref(false)
    onMounted(() => isMounted.value = true)

    const containerRef = ref<Element | ComponentPublicInstance | null>(null)
    watch([containerRef, isMounted, loading], async ([_container, _isMounted, _loading], _, onCleanup) => {
      console.log(_container, _isMounted, _loading)
      if (isNil(_container) || !_isMounted || !_loading) {
        return
      }

      const _el = _container instanceof Element ? _container : _container.$el
      const temp = domToSkeleton(_el)
      const skeletonDom = skeletonToDom(temp)
      _el.appendChild(skeletonDom)

      onCleanup(() => {
        skeletonDom.parentElement?.removeChild(skeletonDom)
      })
    }, { immediate: true, flush: 'post' })

    return () => {
      return h(
        props.as || 'div',
        {
          ...attrs,
          ref: containerRef,
        },
        slots.default?.({ data: loading.value ? presotreData : props.data }),
      )
    }
  },
  {
    props: ['id', 'data', 'limit', 'as', 'loading'],
  },
)

export default Gueleton
