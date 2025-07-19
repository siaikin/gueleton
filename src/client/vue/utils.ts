import type { Ref } from 'vue'
import { onMounted, ref } from 'vue'

export function useMounted(): Ref<boolean> {
  const isMounted = ref(false)
  onMounted(() => isMounted.value = true)
  return isMounted
}
