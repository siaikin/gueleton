import type { ComponentPublicInstance, CSSProperties, SetupContext, SlotsType, VNode } from 'vue'
import type { ComponentProps, SkeletonOptions } from '../core'
import type { PrimitiveProps } from './primitive'
import { isNil, isUndefined, merge } from 'lodash-es'
import { Comment, computed, defineComponent, h, ref, toRef, toRefs, watch } from 'vue'
import { prune, skeleton } from '../core'
import { Primitive } from './primitive'
import { useMounted } from './utils'
import { Provider } from '../core/provider'

export type GueletonProps<DATA> = ComponentProps<DATA, CSSProperties> & PrimitiveProps;

export interface GueletonEvents extends Record<string, any[]> {
}

export interface GueletonSlots<DATA> {
  default?: (params: { data: DATA | null | undefined }) => VNode[]
}

// eslint-disable-next-line style/spaced-comment
export const Gueleton = /*#__PURE__*/ (<T extends object>() => {
  return defineComponent(
    (props: GueletonProps<T>, { slots, attrs }: SetupContext<GueletonEvents, SlotsType<GueletonSlots<T>>>) => {
      const options = computed(() => merge({}, Provider.options, props))

      const { dataKey, data } = toRefs(props)
      const loading = computed(() => props.loading ?? false)
      const forceRender = computed(() => props.forceRender ?? false)

      const prestoreData = ref<T | null | undefined>(undefined)
      const prestoreDataResolved = ref(false)
      watch([dataKey, toRef(props, 'prestoreData')], async ([_dataKey, _prestoreData]) => {
        if (isUndefined(_prestoreData)) {
          prestoreData.value = await Provider.getPrestoreData(_dataKey)
          /**
           * 仅当 prestoreData 来自于 getPrestoreData 时才会被标记为 resolved. 这将确保用户手动设置的 prestoreData 不会被保存到 devServer.
           */
          prestoreDataResolved.value = true
        }
        else {
          prestoreData.value = _prestoreData
        }
      }, { immediate: true })

      /**
       * 当 prestoreData 为空时, 会根据 data 和 limit 生成预存数据, 并发送到 devServer
       */
      watch([prestoreDataResolved, loading, dataKey, data] as const, async ([_resolved, _loading, _dataKey, _data]) => {
        if (!_resolved || !isUndefined(prestoreData.value) || isUndefined(_data) || _loading) {
          return
        }

        await Provider.setPrestoreData(_dataKey, prune(_data, options.value.limit) as T)
        // 保存成功后, 更新 prestoreData
        prestoreData.value = await Provider.getPrestoreData(_dataKey)
      })

      const containerRef = ref<Element | ComponentPublicInstance | null>(null)
      watch(
        [containerRef, useMounted(), loading, options, prestoreData],
        async ([_container, _isMounted, _loading, _options, _prestoreData], _, onCleanup) => {
          if (isNil(_container) || !_isMounted || !_loading) {
            return
          }

          const _el = _container instanceof Element ? _container : _container.$el
          if (isNil(_el)) {
            return
          }

          const unmount = skeleton(_el, { ..._options })
          onCleanup(() => unmount())
        },
        { immediate: true, flush: 'post' },
      )

      return () => {
        const _prestoreData = prestoreData.value
        const _data = data.value
        const _loading = loading.value
        const _forceRender = forceRender.value

        return h(
          Primitive,
          {
            ...attrs,
            as: props.as,
            asChild: props.asChild,
            ref: containerRef,
          },
          () => {
            let vnodes: ReturnType<NonNullable<typeof slots.default>> | undefined

            if (_loading) {
              // 加载中时，使用预存数据，如果没有预存数据则根据 forceRender 决定是否渲染
              vnodes = (isUndefined(_prestoreData) && !_forceRender) ? undefined : slots.default?.({ data: _prestoreData })
            }
            else {
              vnodes = slots.default?.({ data: _data })
            }

            return (vnodes ?? [])
            /**
             * 只是为了更好的开发体验, 允许默认插槽中存在注释节点, render 时会过滤掉注释节点
             */
              .filter(node => node.type !== Comment)
          },
        )
      }
    },
    {
      props: ['dataKey', 'data', 'limit', 'loading', 'forceRender', 'as', 'asChild', 'prestoreData', 'fuzzy', 'bone', 'container', 'type'],
    },
  )
})()

export default Gueleton
