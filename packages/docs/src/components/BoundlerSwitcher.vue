<template>
  <label class="not-content" :class="wrapperClasses">
    <span v-if="selectedBoundler.logo" :class="`ci ci-${selectedBoundler.logo} decorator-left`"></span>

    <span class="trigger-text">
      {{ triggerText }}
    </span>
    
    <select 
      :value="$displayedBoundler"
      :class="selectClasses"
      :disabled="disabled"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
    >
      <option 
        v-for="boundler in $availableBoundlers" 
        :key="boundler.key" 
        :value="boundler.key"
      >
        {{ boundler.displayName }}
      </option>
    </select>
    
    <span v-if="decoratorRight" class="decorator-right">
      <slot name="decorator-right">{{ decoratorRight }}</slot>
    </span>
    
    <svg class="indicator-dropdown" viewBox="0 0 16 16" fill="currentColor">
      <path d="M4.5 6.5L8 10l3.5-3.5H4.5z"/>
    </svg>
  </label>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useStore } from '@nanostores/vue';
import { 
  displayedBoundler, 
  setDisplayedBoundler,
  initializeBoundler,
  displayedFramework,
} from '../store/frameworks';
import type { BoundlerKey } from '../content.config';
import { getFramework, getBoundler } from '../lib/frameworks';

type Color = 'primary' | 'secondary' | 'accent' | 'neutral';
type Size = 'sm' | 'md' | 'lg';

interface Props {
  className?: string;
  appearance?: 'discreet' | 'default';
  level?: Color;
  size?: Size;
  decoratorLeft?: string;
  decoratorRight?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  className: '',
  appearance: 'default',
  level: 'primary',
  size: 'md',
  decoratorLeft: undefined,
  decoratorRight: undefined,
  disabled: false
});

const $displayedFramework = useStore(displayedFramework);
const $displayedBoundler = useStore(displayedBoundler);
const $availableBoundlers = computed(() => {
  return (getFramework($displayedFramework.value).boundlers ?? []).map(key => getBoundler(key));
});
const mounted = ref(false);
const focus = ref(false);

const selectedBoundler = computed(() => getBoundler($displayedBoundler.value));

const triggerText = computed(() => {
  const boundler = $availableBoundlers.value.find(f => f.key === $displayedBoundler.value);
  return boundler ? boundler.displayName : '';
});

const sizeClasses = {
  sm: 'text-sm px-2 py-1',
  md: 'text-base px-3 py-2', 
  lg: 'text-lg px-4 py-3'
};

const wrapperClasses = computed(() => {
  const classes = ['select-wrapper'];
  
  if (props.className) classes.push(props.className);
  if (props.appearance) classes.push(`appearance-${props.appearance}`);
  if (props.level) classes.push(`level-${props.level}`);
  if (focus.value) classes.push('focus');
  if (props.size) classes.push(sizeClasses[props.size]);
  if (props.disabled) classes.push('disabled');
  
  return classes.join(' ');
});

const selectClasses = computed(() => {
  const classes = ['select'];
  return classes.join(' ');
});

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const boundler = target.value as BoundlerKey;
  setDisplayedBoundler(boundler);
};

const handleFocus = (event: FocusEvent) => {
  focus.value = true;
};

const handleBlur = (event: FocusEvent) => {
  focus.value = false;
};

onMounted(() => {
  initializeBoundler();
  mounted.value = true;
});
</script>

<style scoped>
.select-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  border-radius: 0.375rem;
  border: 1px solid var(--sl-color-gray-5);
  background-color: var(--sl-color-bg);
  transition: all 0.2s ease-in-out;
}

.select-wrapper:hover {
  border-color: var(--sl-color-accent);
}

.select-wrapper.focus {
  border-color: var(--sl-color-accent);
  box-shadow: 0 0 0 2px var(--sl-color-accent-low);
}

.select-wrapper.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Appearance variants */
.select-wrapper.appearance-default {
  background-color: var(--sl-color-bg);
  border: 1px solid var(--sl-color-gray-5);
}

.select-wrapper.appearance-discreet {
  background-color: transparent;
  border: none;
}

/* Level variants */
.select-wrapper.level-primary {
  --accent-color: var(--sl-color-accent);
}

.select-wrapper.level-secondary {
  --accent-color: var(--sl-color-gray-6);
}

.decorator-left,
.decorator-right {
  display: flex;
  align-items: center;
  color: var(--sl-color-text-accent);
}

.decorator-left {
  margin-right: 0.5rem;
}

.decorator-right {
  margin-left: 0.5rem;
}

.trigger-text {
  flex: 1;
  color: var(--sl-color-text);
  pointer-events: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.select {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  background: transparent;
  border: none;
  outline: none;
}

.select:disabled {
  cursor: not-allowed;
}

.indicator-dropdown {
  width: 1rem;
  height: 1rem;
  color: var(--sl-color-text-accent);
  pointer-events: none;
  margin-left: 0.5rem;
  transition: transform 0.2s ease-in-out;
}

.select-wrapper.focus .indicator-dropdown {
  transform: rotate(180deg);
}
</style>
