import type { CSSProperties, Ref, SetupContext, SlotsType } from 'vue'
import { isNil, merge } from 'lodash-es'
import { computed, defineComponent, provide } from 'vue'
import { DevelopmentStorage, ProductionStorage } from '../core/storage'
import { DefaultSkeletonOptions, SkeletonOptions } from '../../shared'

export const GueletonProviderKey = Symbol('GueletonProviderKey')
export interface GueletonProviderKeyType<T extends object = object> {
  options: Ref<SkeletonOptions<CSSProperties>>
  getPrestoreData: (id: string) => T | null
  hasPrestoreData: (id: string) => boolean
  setPrestoreData: (id: string, data: T) => Promise<void>
}

export interface GueletonProviderProps extends Partial<SkeletonOptions<CSSProperties>> {
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
      depth: props.depth ?? DefaultSkeletonOptions.depth,
      bone: merge({}, DefaultSkeletonOptions.bone, props.bone),
      container: merge({}, DefaultSkeletonOptions.container, props.container),
    }))

    // eslint-disable-next-line node/prefer-global/process
    const storage = process.env.NODE_ENV === 'production' ? new ProductionStorage() : new DevelopmentStorage()

    provide<GueletonProviderKeyType>(GueletonProviderKey, {
      options,
      getPrestoreData: (id) => {
        try {
          return JSON.parse(storage.getItem(id) ?? 'null')
        }
        catch (err) {
          console.error(err)
          return null
        }
      },
      setPrestoreData: (id, data) => storage.setItem(id, JSON.stringify(data)),
      hasPrestoreData: (id) => {
        const temp = storage.getItem(id)
        return !isNil(temp) && temp.length > 0
      },
    })

    return slots.default ?? (() => { })
  },
  {
    props: ['depth', 'bone', 'container'],
  },
)

export default GueletonProvider
