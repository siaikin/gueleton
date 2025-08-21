import type { ComponentPublicInstance, CSSProperties, SetupContext, SlotsType, VNode } from 'vue'
import type { SkeletonOptions } from '../../shared'
import type { PruneOptions } from '../core'
import type { GueletonProviderKeyType } from './gueleton-provider'
import type { PrimitiveProps } from './primitive'
import { isNil, isNumber, isUndefined, merge } from 'lodash-es'
import { Comment, computed, defineComponent, h, inject, ref, toRef, toRefs, watch } from 'vue'
import { prune, skeleton } from '../core'
import { createContextNotFoundError } from '../core/utils'
import { GueletonProviderKey } from './gueleton-provider'
import { Primitive } from './primitive'
import { useMounted } from './utils'

export type GueletonProps<DATA> = {
  /**
   * 标记预存数据的 key, 可以在在面板中查看和操作预存数据.
   * 相同的 key 将共享相同的预存数据.
   */
  dataKey: string
  /**
   * 代理的原始数据. gueleton 将根据原始数据和 limit 参数生成预存数据.
   */
  data: DATA | null | undefined
  /**
   * 这个参数可以让你直接在代码中设置预存数据, 而不依赖构建时的 vite/webpack 插件.
   *
   * 注意: 在这里手动设置的 prestoreData 不会被保存到 devServer.
   */
  prestoreData?: DATA | null | undefined
  /**
   * 预存数据的裁剪规则. 接受一个 number 或 对象.
   * - 当 limit 为 number 时, 表示取前 limit 项, 仅对数组有效.
   * - 当 limit 为对象时, length 表示取前 length 项, properties 表示裁剪对象的属性, 仅对对象有效.
   */
  limit?: PruneOptions
  /**
   * 控制是否显示骨架屏.
   */
  loading?: boolean
  /**
   * 强制渲染组件, 即使没有预存数据.
   */
  forceRender?: boolean
} & Partial<SkeletonOptions<CSSProperties>> & PrimitiveProps

export interface GueletonEvents extends Record<string, any[]> {
}

export interface GueletonSlots<DATA> {
  default?: (params: { data: DATA | null | undefined }) => VNode[]
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

      const { dataKey } = toRefs(props)
      const data = computed(() => props.data)
      const loading = computed(() => props.loading)
      const forceRender = computed(() => props.forceRender)

      const prestoreData = ref<T | null | undefined>(undefined)
      const prestoreDataResolved = ref(false)
      watch([dataKey, toRef(props, 'prestoreData')], async ([_dataKey, _prestoreData]) => {
        if (isUndefined(_prestoreData)) {
          prestoreData.value = await getPrestoreData(_dataKey)
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
      watch([prestoreDataResolved, loading, dataKey, data, mergedLimit], async ([_resolved, _loading, _dataKey, _data, _mergedLimit]) => {
        if (!_resolved || !isUndefined(prestoreData.value) || isUndefined(_data) || _loading) {
          return
        }

        await setPrestoreData(_dataKey, prune(_data, _mergedLimit) as T)
        // 保存成功后, 更新 prestoreData
        prestoreData.value = await getPrestoreData(_dataKey)
      })

      const containerRef = ref<Element | ComponentPublicInstance | null>(null)
      watch(
        [containerRef, useMounted(), loading, mergedSkeletonOptions, prestoreData],
        async ([_container, _isMounted, _loading, _mergedSkeletonOptions, _prestoreData], _, onCleanup) => {
          if (isNil(_container) || !_isMounted || !_loading) {
            return
          }

          const _el = _container instanceof Element ? _container : _container.$el
          if (isNil(_el)) {
            return
          }

          const unmount = skeleton(_el, { ..._mergedSkeletonOptions })
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
