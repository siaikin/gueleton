<script setup>
import { Toaster } from '@/components/ui/sonner'
import HelloWorld from './HelloWorld.vue'
import 'vue-sonner/style.css'
</script>

<template>
  <Toaster />
  <GueletonProvider :bone="{ className: 'animate-pulse' }">
    <div>
      <HelloWorld />
    </div>
  </GueletonProvider>
</template>

<style></style>
