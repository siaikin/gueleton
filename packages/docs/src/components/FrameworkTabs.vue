<template>
  <div v-if="mounted" :class="`framework-tabs ${className}`">
    <!-- 标签头部 -->
    <div class="tab-headers border-b border-gray-200 dark:border-gray-700 mb-4">
      <div class="flex space-x-1 overflow-x-auto">
        <button
          v-for="frameworkKey in frameworks"
          :key="frameworkKey"
          @click="handleTabClick(frameworkKey)"
          :class="getTabClasses(frameworkKey)"
          :style="getTabStyle(frameworkKey)"
        >
          <span class="flex items-center space-x-2">
            <span>{{ getFramework(frameworkKey).displayName }}</span>
          </span>
        </button>
      </div>
    </div>

    <!-- 标签内容 -->
    <div class="tab-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useStore } from '@nanostores/vue';
import { displayedFramework, setDisplayedFramework } from '../store/frameworks';
import type { FrameworkKey } from '../content.config';
import { getFramework } from '../lib/frameworks';

interface Props {
  frameworks: FrameworkKey[];
  className?: string;
}

const props = withDefaults(defineProps<Props>(), {
  className: ''
});

const $displayedFramework = useStore(displayedFramework);
const mounted = ref(false);

const activeFramework = computed(() => {
  return props.frameworks.includes($displayedFramework.value) 
    ? $displayedFramework.value 
    : props.frameworks[0];
});

const handleTabClick = (framework: FrameworkKey) => {
  setDisplayedFramework(framework);
};

const getTabClasses = (frameworkKey: FrameworkKey) => {
  const isActive = frameworkKey === activeFramework.value;
  return `
    px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors
    ${isActive 
      ? 'text-blue-600 border-blue-600 bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:bg-blue-900/20'
      : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
    }
  `;
};

const getTabStyle = (frameworkKey: FrameworkKey) => {
  const isActive = frameworkKey === activeFramework.value;
  const framework = getFramework(frameworkKey);
  return isActive ? { borderBottomColor: framework.color } : {};
};

onMounted(() => {
  mounted.value = true;
});
</script>
