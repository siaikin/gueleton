<template>
  <Gueleton
    :data-key="dataKey"
    :data="data"
    :loading="loading"
    :skeleton="{
      type,
      fuzzy,
    }"
    v-slot="{ data }"
  >
    <div class="w-96 mx-auto aspect-video border rounded-lg overflow-hidden">
      <div class="size-full p-6 bg-red-50">
        <div class="size-full p-6 bg-red-100">
          <div class="size-full p-6 bg-red-200">
            <div class="size-full p-6 bg-red-300">
              <div class="size-full flex items-center justify-center">
                <span>Gueleton</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Gueleton>
</template>

<script setup>
import { computed } from 'vue'

import { gueletonOptions } from '../../../store/gueleton-options';
import { useStore } from '@nanostores/vue';

const $gueletonOptions = useStore(gueletonOptions);

const dataKey = computed(() => $gueletonOptions.value.dataKey);
const data = computed(() => $gueletonOptions.value.data);
const loading = computed(() => $gueletonOptions.value.loading);

const skeleton = computed(() => $gueletonOptions.value.skeleton);

const type = computed(() => skeleton.value.type);
const fuzzy = computed(() => skeleton.value.fuzzy);
</script>
