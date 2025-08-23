<script lang="ts" setup generic="T">
import type { ComponentPublicInstance, CSSProperties } from 'vue'
import type { ComponentProps } from '../core'
import type { PrimitiveProps } from './primitive'
import { isNil, isUndefined, merge } from 'lodash-es'
import { computed, ref, watch } from 'vue'
import { Provider, prune, skeleton } from '../core'
import { Primitive } from './primitive'
import { useMounted } from './utils'

type GueletonProps<DATA> = ComponentProps<DATA, CSSProperties> & PrimitiveProps

const props = defineProps<GueletonProps<T>>()

defineSlots<{
  default: (params: { data: T | null | undefined }) => any
}>()

const options = computed(() => merge({}, Provider.options, props))
const data = computed(() => props.data)
const dataKey = computed(() => props.dataKey)
const loading = computed(() => props.loading ?? false)
const forceRender = computed(() => props.forceRender ?? false)

const prestoreData = ref<any | null | undefined>(undefined)
const prestoreDataResolved = ref(false)
watch([dataKey, () => props.prestoreData], async ([_dataKey, _prestoreData]) => {
  if (isUndefined(_prestoreData)) {
    prestoreData.value = await Provider.getPrestoreData(_dataKey)
    prestoreDataResolved.value = true
  }
  else {
    prestoreData.value = _prestoreData
  }
}, { immediate: true })

watch([prestoreDataResolved, loading, dataKey, data] as const, async ([_resolved, _loading, _dataKey, _data]) => {
  if (!_resolved || !isUndefined(prestoreData.value) || isUndefined(_data) || _loading) {
    return
  }
  await Provider.setPrestoreData(_dataKey, prune(_data, options.value.limit))
  prestoreData.value = await Provider.getPrestoreData(_dataKey)
})

const containerRef = ref<Element | ComponentPublicInstance | null>(null)
watch(
  [containerRef, useMounted(), loading, options, prestoreData],
  async ([_container, _isMounted, _loading, _options, _prestoreData], _, onCleanup) => {
    if (isNil(_container) || !_isMounted || !_loading) {
      return
    }
    const _el = _container instanceof Element ? _container : _container.$el
    if (isNil(_el)) {
      return
    }
    const unmount = skeleton(_el, { ..._options })
    onCleanup(() => unmount())
  },
  { immediate: true, flush: 'post' },
)
</script>

<template>
  <Primitive
    ref="containerRef"
    :as="as"
    :as-child="asChild"
  >
    <template v-if="loading">
      <slot v-if="!isUndefined(prestoreData) || forceRender" :data="prestoreData" />
    </template>
    <template v-else>
      <slot :data="data" />
    </template>
  </Primitive>
</template>
