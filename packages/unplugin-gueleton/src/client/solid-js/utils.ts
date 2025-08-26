import { createSignal, onMount } from 'solid-js'

export function useMounted() {
  const [isMounted, setIsMounted] = createSignal(false)
  onMount(() => setIsMounted(true))
  return isMounted
}
