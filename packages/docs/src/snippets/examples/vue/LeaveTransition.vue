<template>
  <Gueleton
    :data-key="dataKey"
    :data="data"
    :loading="loading"
    :skeleton="{
      type,

      container: {
        leave: {
          className: 'opacity-0 transition-opacity duration-300',
        }
      },
    }"
    v-slot="{ data }"
  >
    <div class="flex flex-col gap-4 p-4 bg-(--color-red-50)">
      <TweetCard v-for="(item, index) in data" :key="index" v-bind="item" />
    </div>
  </Gueleton>
</template>

<script setup>
import { computed } from 'vue'
import TweetCard from './TweetCard.vue';

import { gueletonOptions } from '../../../store/gueleton-options';
import { useStore } from '@nanostores/vue';

const $gueletonOptions = useStore(gueletonOptions);

const dataKey = computed(() => $gueletonOptions.value.dataKey);
const data = computed(() => $gueletonOptions.value.data);
const loading = computed(() => $gueletonOptions.value.loading);

const skeleton = computed(() => $gueletonOptions.value.skeleton);

const type = computed(() => skeleton.value.type);

</script>
