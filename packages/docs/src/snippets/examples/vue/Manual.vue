<template>
  <Gueleton
    :data-key="dataKey"
    :data="data"
    :loading="loading"
    v-slot="{ data }"
  >
    <div class="p-4 border rounded-lg shadow-sm bg-white not-content">
      <!-- Tweet header -->
      <div class="flex items-start gap-3">
        <div class="h-12 w-12">
          <img class="size-full rounded-full object-cover"
            :src="avatar" alt="avatar">
        </div>
        <div
          data-gueleton-bone
          class="flex-1"
        >
          <div class="flex items-center gap-2">
            <span class="font-semibold text-sm"> Siaikin </span>
            <span class="text-gray-500 text-sm">@user · 2m</span>
          </div>
          <p class="mt-2 text-gray-800">
            Just setting up my Gueleton. #myfirstgueleton
          </p>
        </div>
      </div>

      <!-- Tweet actions -->
      <div class="mt-3 flex items-center justify-between text-gray-500 text-sm">
        <div class="flex gap-6">
          <button class="flex items-center gap-2 hover:text-blue-500">💬 <span> 0 </span></button>
          <button class="flex items-center gap-2 hover:text-green-500">🔁 <span> 0 </span></button>
          <button class="flex items-center gap-2 hover:text-red-500">❤️ <span> 0 </span></button>
        </div>
        <div class="text-xs">Translate</div>
      </div>
    </div>
  </Gueleton>
</template>

// ---cut-after---

<script setup>
import { computed } from 'vue'

import { gueletonOptions } from '../../../store/gueleton-options';
import { useStore } from '@nanostores/vue';

const $gueletonOptions = useStore(gueletonOptions);

const dataKey = computed(() => $gueletonOptions.value.dataKey);
const data = computed(() => $gueletonOptions.value.data);
const loading = computed(() => $gueletonOptions.value.loading);
</script>
