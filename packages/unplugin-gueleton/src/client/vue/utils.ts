import type { MaybeRefOrGetter, Ref } from 'vue'
import { onMounted, ref, toValue } from 'vue'

export function useMounted(): Ref<boolean> {
  const isMounted = ref(false)
  onMounted(() => isMounted.value = true)
  return isMounted
}

export type ToMaybeRefOrGetter<T> = {
  [K in keyof T]: MaybeRefOrGetter<T[K]>
}

export function refOrGetterMapToRaw<T>(obj: ToMaybeRefOrGetter<T>): T {
  const result = {} as T

  const keys = Object.keys(obj) as (keyof T)[]
  for (const key of keys) {
    result[key] = toValue(obj[key] as MaybeRefOrGetter<T[keyof T]>)
  }
  return result
}
