<template>
  <div class="flex gap-4 p-4">
    <Gueleton
      :data="data"
      :data-key="dataKey"
      :loading="userInfoLoading"
      :limit="limit"
      :skeleton="{ fuzzy, type, bone, container }"
      v-slot="{ data }"
    >
      <UserCard
        class="flex-none w-48"
        avatar="https://i.pravatar.cc/150?img=3"
        name="Jane Doe"
        username="janedoe"
        bio="Lover of technology and nature."
        :followers="1200"
        :following="300"
      />
    </Gueleton>

    <div class="flex flex-col gap-4">
      <Gueleton
        :data="data"
        :data-key="dataKey"
        :loading="loading"
        :limit="limit"
        :skeleton="{ fuzzy, type, bone, container }"
        v-slot="{ data }"
      >
        <TweetCard v-bind="data?.[0]" />
      </Gueleton>
    
      <Gueleton
        :data="data"
        :data-key="dataKey"
        :loading="card2Loading"
        :limit="limit"
        :skeleton="{ fuzzy, type, bone, container }"
        v-slot="{ data }"
      >
        <TweetCard v-bind="data?.[1]" />
      </Gueleton>
    </div>
</div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import TweetCard from './TweetCard.vue';
import UserCard from './UserCard.vue';

import { gueletonOptions } from '../../../store/gueleton-options';
import { useStore } from '@nanostores/vue';

const $gueletonOptions = useStore(gueletonOptions);

const dataKey = computed(() => $gueletonOptions.value.dataKey);
const data = computed(() => $gueletonOptions.value.data);
const loading = computed(() => $gueletonOptions.value.loading);

const limit = computed(() => $gueletonOptions.value.limit);
const skeleton = computed(() => $gueletonOptions.value.skeleton);

const fuzzy = computed(() => skeleton.value.fuzzy);
const type = computed(() => skeleton.value.type);
const bone = computed(() => skeleton.value.bone);
const container = computed(() => skeleton.value.container);

const userInfoLoading = ref(loading.value);
watch(loading, async (newVal) => {
  if (newVal) {
    userInfoLoading.value = true;
  } else {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 * 2));
    userInfoLoading.value = false;
  }
});

const card2Loading = ref(loading.value);
watch(loading, async (newVal) => {
  if (newVal) {
    card2Loading.value = true;
  } else {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 * 2));
    card2Loading.value = false;
  }
});
</script>
