import type { CSSProperties, Ref, SetupContext, SlotsType } from 'vue'
import type { SkeletonOptions } from '../../shared'
import type { PruneOptions } from '../core'
import { isNil, merge } from 'lodash-es'
import { computed, defineComponent, provide } from 'vue'
import { DefaultSkeletonOptions } from '../../shared'
import { DevelopmentStorage, ProductionStorage } from '../core/storage'

export const GueletonProviderKey = Symbol('GueletonProviderKey')
export interface GueletonProviderKeyType<T extends object = object> {
  options: Ref<SkeletonOptions<CSSProperties>>
  limit: Ref<PruneOptions>
  getPrestoreData: (id: string) => Promise<T | null>
  hasPrestoreData: (id: string) => Promise<boolean>
  setPrestoreData: (id: string, data: T) => Promise<void>
}

export interface GueletonProviderProps extends Partial<SkeletonOptions<CSSProperties>> {
  /**
   * 设置全局的数据裁剪选项. 默认为 `3`.
   */
  limit?: PruneOptions
}

export interface GueletonProviderEvents extends Record<string, any[]> {
}

export interface GueletonProviderSlots {
  default?: () => any
}

// eslint-disable-next-line style/spaced-comment
export const GueletonProvider = /*#__PURE__*/ defineComponent(
  (props: GueletonProviderProps, { slots }: SetupContext<GueletonProviderEvents, SlotsType<GueletonProviderSlots>>) => {
    const options = computed(() => ({
      fuzzy: props.fuzzy ?? DefaultSkeletonOptions.fuzzy,
      type: props.type ?? DefaultSkeletonOptions.type,
      bone: merge({}, DefaultSkeletonOptions.bone, props.bone),
      container: merge({}, DefaultSkeletonOptions.container, props.container),
    }))
    const limit = computed(() => props.limit ?? 3)

    // eslint-disable-next-line node/prefer-global/process
    const storage = process.env.NODE_ENV === 'production' ? new ProductionStorage() : new DevelopmentStorage()

    provide<GueletonProviderKeyType>(GueletonProviderKey, {
      options,
      limit,
      getPrestoreData: async (id) => {
        try {
          return JSON.parse(await storage.getItem(id) ?? '')
        }
        catch (err) {
          console.warn(`getPrestoreData error: ${err}`)
          return null
        }
      },
      setPrestoreData: async (id, data) => await storage.setItem(id, JSON.stringify(data)),
      hasPrestoreData: async (id) => {
        const temp = await storage.getItem(id)
        return !isNil(temp) && temp.length > 0
      },
    })

    return slots.default ?? (() => { })
  },
  {
    props: ['fuzzy', 'bone', 'container', 'limit', 'type'],
  },
)

export default GueletonProvider
