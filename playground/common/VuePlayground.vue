<script setup>
import { onMounted, ref, watch } from 'vue'

const loading = ref(false)
const type = ref('overlay')
const fuzzy = ref(1)
const fetchDelay = ref(localStorage.getItem('fetchDelay') ? Number(localStorage.getItem('fetchDelay')) : 0)
watch(fetchDelay, (v) => localStorage.setItem('fetchDelay', String(v)))

const list = ref([])
async function handleRefresh() {
  try {
    loading.value = true
    list.value = (await (await fetch('https://api.sampleapis.com/switch/games')).json()).slice(0, 48)

    if (fetchDelay.value) {
      await new Promise((resolve) => setTimeout(resolve, fetchDelay.value * 1000))
    }
  }
  finally {
    loading.value = false
  }
}
onMounted(handleRefresh)
</script>

<template>
  <div class="h-screen flex flex-col gap-2 p-2">
    <div class="flex gap-2">
      <button class="border border-slate-600 px-2 py-1 bg-slate-500 text-slate-100 cursor-pointer" @click="handleRefresh">Refresh</button>

      <label class="border border-slate-600 px-2 py-1 flex items-center gap-1">
        Loading
        <input v-model="loading" type="checkbox">
      </label>

      <label class="border border-slate-600 px-2 py-1 flex items-center gap-1">
        Fuzzy
        <input v-model.number="fuzzy" type="range" :min="0" :max="10">
        <span>({{ fuzzy }})</span>
      </label>

      <span class="flex-auto" />

      <label class="border border-slate-600 px-2 py-1 flex items-center gap-1">
        Type
        <select v-model="type">
          <option value="overlay">Overlay</option>
          <option value="inPlace">In-place</option>
        </select>
      </label>
    </div>

    <div class="flex gap-2">
      <label class="border border-slate-600 px-2 py-1 flex items-center gap-1">
        Fetch Delay
        <input v-model.number="fetchDelay" type="range" :min="0" :max="12">
        <span>({{ fetchDelay }}s)</span>
      </label>
    </div>

      <Gueleton data-key="switchGameList" v-slot="{ data }" :data="list" :loading="loading" :type="type" :fuzzy="fuzzy" as-child>
        <div class="flex-auto overflow-x-auto border">
          <div v-for="item in data" :key="item.id"
            class="p-4 border-b border-slate-200 hover:bg-slate-50 transition-all duration-200 hover:shadow-sm">
            <div class="flex items-start gap-4">
              <!-- Game Icon/Avatar -->
              <div class="size-16 rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 flex-shrink-0 shadow-sm" data-gueleton-bone />
              
              <!-- Main Content -->
              <div class="flex-1 min-w-0">
                <!-- Game Title -->
                <h1 class="text-xl font-bold text-slate-800 mb-2 line-clamp-2" data-gueleton-bone>
                  {{ item.name }}
                </h1>
                
                <!-- Genre Tags -->
                <div class="flex flex-wrap gap-1 mb-3" v-if="item.genre?.length">
                  <span v-for="g in item.genre" :key="g" 
                    class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium" 
                    data-gueleton-bone>
                    {{ g }}
                  </span>
                </div>
                
                <!-- Developer & Publisher Info -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3 text-sm">
                  <div v-if="item.developers?.length">
                    <span class="text-slate-500 font-medium">开发商:</span>
                    <span class="text-slate-700 ml-1" data-gueleton-bone>{{ item.developers.join(', ') }}</span>
                  </div>
                  <div v-if="item.publishers?.length">
                    <span class="text-slate-500 font-medium">发行商:</span>
                    <span class="text-slate-700 ml-1" data-gueleton-bone>{{ item.publishers.join(', ') }}</span>
                  </div>
                </div>
                
                <!-- Release Dates -->
                <div v-if="item.releaseDates" class="bg-slate-50 rounded-lg p-3">
                  <h4 class="text-sm font-semibold text-slate-600 mb-2">发布日期</h4>
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div v-for="(date, region) in item.releaseDates" :key="region" class="flex flex-col">
                      <span class="text-slate-500 font-medium capitalize">{{ region }}</span>
                      <span class="text-slate-700" data-gueleton-bone>{{ date }}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Game ID Badge -->
              <div class="flex-shrink-0">
                <span class="inline-flex items-center px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-mono">
                  #{{ item.id }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Gueleton>
  </div>
</template>

<style scoped>
.hello {
  text-align: center;
}
</style>
