<template>
  <!-- Summary Card (thumbnail) - Tailwind CSS -->
  <div class="p-4 border rounded-lg shadow-sm bg-white not-content">
    <!-- Tweet header -->
    <div class="flex items-start gap-3">
      <div class="h-12 w-12">
        <img class="size-full rounded-full object-cover"
          :src="avatar" alt="avatar">
      </div>
      <div class="flex-1">
        <div class="flex items-center gap-2">
          <span class="font-semibold text-sm">{{ author }}</span>
          <span class="text-gray-500 text-sm">@user · {{ date }}</span>
        </div>
        <p class="mt-2 text-gray-800 p-4 bg-(--color-red-50)">
          <div>
            {{ content }}
          </div>
        </p>
      </div>
    </div>

    <!-- Tweet actions -->
    <div class="mt-3 flex items-center justify-between text-gray-500 text-sm">
      <div class="flex gap-6">
        <button class="flex items-center gap-2 hover:text-blue-500">💬 <span>{{ comments }}</span></button>
        <button class="flex items-center gap-2 hover:text-green-500">🔁 <span>{{ retweets }}</span></button>
        <button class="flex items-center gap-2 hover:text-red-500">❤️ <span>{{ likes }}</span></button>
      </div>
      <div class="text-xs">Translate</div>
    </div>
  </div>

</template>

<script setup lang="ts">
import type { TweetCard } from '../../../lib/mock-utils';

defineProps<TweetCard>();
</script>
