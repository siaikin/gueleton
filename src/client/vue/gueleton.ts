import type { ComponentPublicInstance, CSSProperties, SetupContext, SlotsType, VNode } from 'vue'
import type { SkeletonOptions } from '../../shared'
import type { PruneOptions } from '../core'
import type { GueletonProviderKeyType } from './gueleton-provider'
import type { PrimitiveProps } from './primitive'
import { isEmpty, isNil, merge } from 'lodash-es'
import { Comment, computed, defineComponent, h, inject, ref, toRefs, watch } from 'vue'
import { domToSkeleton, prune, skeletonToDom } from '../core'
import { createContextNotFoundError } from '../core/utils'
import { GueletonProviderKey } from './gueleton-provider'
import { Primitive } from './primitive'
import { useMounted } from './utils'

export type GueletonProps<DATA> = {
  id: string
  data: DATA
  /**
   * 这个参数可以让你直接在代码中设置预存数据, 而不依赖构建时的 vite/webpack 插件.
   * 当 prestoreData 不为空时, 会直接使用 prestoreData, 而不会根据 data 生成预存数据.
   *
   * 内部使用 [lodash.isEmpty](https://lodash.com/docs/4.17.15#isEmpty) 判断 prestoreData 是否为空.
   */
  prestoreData?: DATA | null | undefined
  limit?: PruneOptions
  loading?: boolean
} & Partial<SkeletonOptions<CSSProperties>> & PrimitiveProps

export interface GueletonEvents extends Record<string, any[]> {
}

export interface GueletonSlots<DATA> {
  default?: (params: { data: DATA }) => VNode[]
}

// eslint-disable-next-line style/spaced-comment
export const Gueleton = /*#__PURE__*/ (<T extends object>() => {
  return defineComponent(
    (props: GueletonProps<T>, { slots, attrs }: SetupContext<GueletonEvents, SlotsType<GueletonSlots<T>>>) => {
      const provider = inject<GueletonProviderKeyType<T>>(GueletonProviderKey)
      if (isNil(provider)) {
        throw createContextNotFoundError(GueletonProviderKey, 'GueletonProvider')
      }

      const { options, getPrestoreData, setPrestoreData } = provider

      const mergedSkeletonOptions = computed(() => {
        const { depth, bone, container } = options.value
        return {
          depth: props.depth ?? depth,
          bone: merge({}, bone, props.bone),
          container: merge({}, container, props.container),
        }
      })

      const { id } = toRefs(props)
      const data = computed(() => props.data)
      const loading = computed(() => props.loading)
      const limit = computed(() => props.limit)

      const prestoreData = computed(() => props.prestoreData ?? getPrestoreData(id.value))

      watch([id, data, limit], ([_id, _data, _limit]) => {
        if (!isEmpty(prestoreData.value)) {
          return
        }

        setPrestoreData(_id, prune(_data as object, _limit) as T)
      })

      const isMounted = useMounted()

      const containerRef = ref<Element | ComponentPublicInstance | null>(null)
      watch([containerRef, isMounted, loading, mergedSkeletonOptions], async ([_container, _isMounted, _loading, _mergedSkeletonOptions], _, onCleanup) => {
        if (isNil(_container) || !_isMounted || !_loading) {
          return
        }

        const _el = _container instanceof Element ? _container : _container.$el
        const temp = domToSkeleton(_el, _mergedSkeletonOptions)
        const skeletonDom = skeletonToDom(temp)
        _el.appendChild(skeletonDom)

        onCleanup(() => {
          skeletonDom.parentElement?.removeChild(skeletonDom)
        })
      }, { immediate: true, flush: 'post' })

      return () => {
        const outputData = (loading.value && !isEmpty(prestoreData.value)) ? prestoreData.value : data.value
        return h(
          Primitive,
          {
            ...attrs,
            // eslint-disable-next-line ts/ban-ts-comment
            // @ts-expect-error
            as: props.as,
            // eslint-disable-next-line ts/ban-ts-comment
            // @ts-expect-error
            asChild: props.asChild,
            ref: containerRef,
          },
          () => slots.default?.({ data: outputData })?.filter(node => node.type !== Comment),
        )
      }
    },
    {
      props: ['id', 'data', 'limit', 'loading', 'as', 'asChild', 'prestoreData', 'depth', 'bone', 'container'],
    },
  )
})()

export default Gueleton
