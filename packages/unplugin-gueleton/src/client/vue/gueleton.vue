<script lang="ts" setup generic="T">
import type { ComponentPublicInstance } from 'vue'
import type { GueletonOptions } from '../core'
import { ref, toRefs } from 'vue'
import { Slot } from './primitive/slot'
import { useGueleton } from './use-gueleton'

type Props = Partial<Omit<GueletonOptions<T>, 'dataKey'>> & Pick<GueletonOptions<T>, 'dataKey'>

const props = defineProps<Props>()
defineSlots<{
  default: (params: { data: T | null | undefined }) => any
}>()

const { dataKey, ...restProps } = toRefs(props)

const containerRef = ref<Element | ComponentPublicInstance | undefined>()

const { render, data } = useGueleton(dataKey, containerRef, { ...restProps })
</script>

<template>
  <Slot ref="containerRef">
    <template v-if="render">
      <slot :data="data" />
    </template>
  </Slot>
</template>
