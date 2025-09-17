<template>
  <Gueleton
    :data="data"
    :data-key="dataKey"
    :loading="loading"
    :limit="limit"

    :skeleton="{
      fuzzy,
      type,
      bone,
      container
    }"
    v-slot="{ data }"
  >
    <div class="flex flex-col gap-4 p-4 bg-(--color-red-50)">
      <TweetCard v-for="(item, index) in data" :key="index" v-bind="item" />
    </div>
  </Gueleton>
</template>

// ---cut-after---

<script setup>
import { computed } from 'vue'
import TweetCard from './TweetCard.vue';

import { gueletonOptions } from '../../../store/gueleton-options';
import { useStore } from '@nanostores/vue';

const $gueletonOptions = useStore(gueletonOptions);

const dataKey = computed(() => $gueletonOptions.value.dataKey);
const data = computed(() => $gueletonOptions.value.data || []);
const loading = computed(() => $gueletonOptions.value.loading);

const limit = computed(() => $gueletonOptions.value.limit);
const skeleton = computed(() => $gueletonOptions.value.skeleton);

const fuzzy = computed(() => skeleton.value.fuzzy);
const type = computed(() => skeleton.value.type);
const bone = computed(() => skeleton.value.bone);
const container = computed(() => skeleton.value.container);
</script>
