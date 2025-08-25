<script lang="ts" setup generic="T">
import type { ComponentPublicInstance, CSSProperties } from 'vue'
import type { GueletonOptions } from '../core'
import { ref, shallowReactive, toRaw, toRefs, watch } from 'vue'
import { Gueleton } from '../core'
import { Slot } from './primitive/slot'

const props = defineProps<GueletonOptions<T, CSSProperties>>()

defineSlots<{
  default: (params: { data: T | null | undefined }) => any
}>()

const gueleton = shallowReactive(new Gueleton(props.dataKey, toRaw(props)))

const propRefs = Object.values(toRefs(props))

const containerRef = ref<Element | ComponentPublicInstance | null>(null)

watch([...propRefs, containerRef], () => {
  gueleton.updateOptions(
    toRaw(props),
    () => containerRef.value instanceof Element ? containerRef.value : containerRef.value?.$el,
  )
}, { immediate: true })
</script>

<template>
  <Slot ref="containerRef">
    <template v-if="gueleton.shouldRender">
      <slot :data="gueleton.renderData" />
    </template>
  </Slot>
</template>
