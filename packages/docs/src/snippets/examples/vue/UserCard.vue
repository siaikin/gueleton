<template>
  <aside class="p-4 border rounded-lg shadow-sm bg-white flex flex-col items-center">
    <div class="mb-3">
      <img class="h-20 w-20 rounded-full object-cover" :src="avatar" alt="avatar" />
    </div>
    <div class="text-center">
      <div class="font-semibold text-lg">{{ name }}</div>
      <div class="text-gray-500 text-sm mb-2">@{{ username }}</div>
      <div class="text-gray-700 text-sm mb-4">{{ bio }}</div>
    </div>
    <div class="flex gap-6 mb-4">
      <div class="text-center">
        <div class="font-bold text-base">{{ followers }}</div>
        <div class="text-xs text-gray-500">followers</div>
      </div>
      <div class="text-center">
        <div class="font-bold text-base">{{ following }}</div>
        <div class="text-xs text-gray-500">following</div>
      </div>
    </div>
    <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">Follow</button>
  </aside>
</template>

<script setup lang="ts">
defineProps<{
  avatar: string
  name: string
  username: string
  bio?: string
  followers: number
  following: number
}>()
</script>
