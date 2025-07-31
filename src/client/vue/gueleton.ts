import type { ComponentPublicInstance, CSSProperties, SetupContext, SlotsType, VNode } from 'vue'
import type { SkeletonOptions } from '../../shared'
import type { PruneOptions } from '../core'
import type { GueletonProviderKeyType } from './gueleton-provider'
import type { PrimitiveProps } from './primitive'
import { isEmpty, isNil, isNumber, merge } from 'lodash-es'
import { Comment, computed, defineComponent, h, inject, ref, toRef, toRefs, watch } from 'vue'
import { prune, skeleton } from '../core'
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

      const { options, limit, getPrestoreData, setPrestoreData } = provider

      const mergedSkeletonOptions = computed(() => {
        const { fuzzy, type, bone, container } = options.value
        return {
          fuzzy: isNumber(props.fuzzy) ? props.fuzzy : fuzzy,
          type: isNil(props.type) ? type : props.type,
          bone: merge({}, bone, props.bone),
          container: merge({}, container, props.container),
        }
      })
      const mergedLimit = computed(() => props.limit ?? limit.value)

      const { id } = toRefs(props)
      const data = computed(() => props.data)
      const loading = computed(() => props.loading)

      const prestoreData = ref<T | null | undefined>(null)
      watch([id, toRef(props, 'prestoreData')], async ([_id, _prestoreData]) => {
        prestoreData.value = _prestoreData ?? await getPrestoreData(_id)
      }, { immediate: true })

      /**
       * 当 prestoreData 为空时, 会根据 data 和 limit 生成预存数据, 并发送到 devServer
       */
      watch([id, data, mergedLimit], async ([_id, _data, _mergedLimit]) => {
        if (!isEmpty(prestoreData.value) || isEmpty(_data)) {
          return
        }
        await setPrestoreData(_id, prune(_data, _mergedLimit) as T)
        // 保存成功后, 更新 prestoreData
        prestoreData.value = await getPrestoreData(_id)
      }, { immediate: true })

      const containerRef = ref<Element | ComponentPublicInstance | null>(null)
      watch(
        [containerRef, useMounted(), loading, mergedSkeletonOptions, prestoreData],
        async ([_container, _isMounted, _loading, _mergedSkeletonOptions, _prestoreData], _, onCleanup) => {
          if (isNil(_container) || !_isMounted || !_loading) {
            return
          }

          const _el = _container instanceof Element ? _container : _container.$el
          const unmount = skeleton(_el, { ..._mergedSkeletonOptions })
          onCleanup(() => unmount())
        },
        { immediate: true, flush: 'post' },
      )

      return () => {
        return h(
          Primitive,
          {
            ...attrs,
            as: props.as,
            asChild: props.asChild,
            ref: containerRef,
          },
          () => slots.default?.({ data: (loading.value && !isEmpty(prestoreData.value)) ? prestoreData.value : data.value })
            /**
             * 只是为了更好的开发体验, 允许默认插槽中存在注释节点, render 时会过滤掉注释节点
             */
            ?.filter(node => node.type !== Comment),
        )
      }
    },
    {
      props: ['id', 'data', 'limit', 'loading', 'as', 'asChild', 'prestoreData', 'fuzzy', 'bone', 'container', 'type'],
    },
  )
})()

export default Gueleton
