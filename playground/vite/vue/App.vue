<script setup>
import HelloWorld from './HelloWorld.vue'
</script>

<template>
  <GueletonProvider :bone="{ className: 'animate-pulse' }">
    <div>
      <h1>Vue 应用初始化</h1>
      <HelloWorld />
    </div>
  </GueletonProvider>
</template>

<style></style>
