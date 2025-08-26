<script lang="ts" setup generic="T">
import type { ComponentPublicInstance, CSSProperties } from 'vue'
import type { GueletonOptions } from '../core'
import { ref, toRefs } from 'vue'
import { Slot } from './primitive/slot'
import { useGueleton } from './use-gueleton'

const props = defineProps<GueletonOptions<T, CSSProperties>>()
defineSlots<{
  default: (params: { data: T | null | undefined }) => any
}>()

const { dataKey, ...restProps } = toRefs(props)

const containerRef = ref<Element | ComponentPublicInstance | null | undefined>(null)

const { shouldRender, renderData } = useGueleton(dataKey, containerRef, { ...restProps })
</script>

<template>
  <Slot ref="containerRef">
    <template v-if="shouldRender">
      <slot :data="renderData" />
    </template>
  </Slot>
</template>
