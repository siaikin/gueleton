import type { SetupContext, SlotsType } from 'vue'
import { defineComponent, provide } from 'vue'
import { DevelopmentStorage, ProductionStorage } from '../core/storage'

export const GueletonProviderKey = Symbol('GueletonProviderKey')
export interface GueletonProviderKeyType<T extends object = object> {
  getPrestoreData: (id: string) => T
  setPrestoreData: (id: string, data: T) => Promise<void>
}

interface ComponentProps {
}

interface Events extends Record<string, any[]> {
}

interface ComponentSlots {
  default?: () => any
}

// eslint-disable-next-line style/spaced-comment
export const GueletonProvider = /*#__PURE__*/ defineComponent(
  (props: ComponentProps, { slots }: SetupContext<Events, SlotsType<ComponentSlots>>) => {
    // eslint-disable-next-line node/prefer-global/process
    const storage = process.env.NODE_ENV === 'production' ? new ProductionStorage() : new DevelopmentStorage()

    provide<GueletonProviderKeyType>(GueletonProviderKey, {
      getPrestoreData: (id) => {
        try {
          return JSON.parse(storage.getItem(id) ?? 'null')
        }
        catch (err) {
          console.error(err)
          return null
        }
      },
      setPrestoreData: async (id, data) => {
        await storage.setItem(id, JSON.stringify(data))
      },
    })

    return slots.default ?? (() => { })
  },
  {
    props: ['id', 'data'],
  },
)

export default GueletonProvider
