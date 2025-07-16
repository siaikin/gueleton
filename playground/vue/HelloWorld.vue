<script setup>
import { onMounted, ref } from 'vue'

const list = ref([])
const loading = ref(false)
async function handleRefresh() {
  try {
    loading.value = true
    const resp = await fetch('https://api.sampleapis.com/switch/games')
    const json = await resp.json()

    // await new Promise(resolve => setTimeout(resolve, 100000))
    list.value = json
  }
  finally {
    loading.value = false
  }
}
onMounted(handleRefresh)
</script>

<template>
  <button class="bg-blue-500 text-white rounded p-2" @click="handleRefresh">Refresh</button>
  <Gueleton
    id="switchGameList"
    v-slot="{ data }"
    :data="list"
    :limit="3"
    :loading="loading"
    class="h-96 overflow-auto border m-4"
  >
    <div v-for="item in data" :key="item.id" class="p-4 border-b border-gray-200 hover:bg-gray-100 transition-colors">
      <h1 class="text-2xl font-bold text-blue-600">
        {{ item.name }}
      </h1>
    </div>
  </Gueleton>
</template>

<style scoped>
.hello {
  text-align: center;
}
</style>
