<script setup lang="ts">
import { computed } from 'vue';

export type ButtonType = 'colored' | 'secondary' | 'disabled';

const props = defineProps<{
  type: ButtonType;
}>();

const colors: Record<string, Record<string, string>> = {
  "secondary": {
    tl: '#ffffff20',
    tr: '#ffffff20',
    bl: '#ffffff20',
    br: '#ffffff20'
  },
  "disabled": {
    tl: '#ffffff20',
    tr: '#ffffff20',
    bl: '#ffffff20',
    br: '#ffffff20'
  },
  "colored": {
    tl: '#DE4652',
    tr: '#3497D5',
    bl: '#FCCC43',
    br: '#39A749'
  },
}

const selectedColors = computed(() => colors[props.type] || colors['secondary']);
</script>

<template>
  <div class="border-container">
    <div class="background">
      <div class="background-color tl" :style="`--color: ${selectedColors['tl']}`"></div>
      <div class="background-color tr" :style="`--color: ${selectedColors['tr']}`"></div>
      <div class="background-color bl" :style="`--color: ${selectedColors['bl']}`"></div>
      <div class="background-color br" :style="`--color: ${selectedColors['br']}`"></div>
    </div>
    <slot></slot>
  </div>
</template>

<style scoped>
.border-container {
  position: relative;
  display: inline-block;
  overflow: hidden;
  padding: 3px;
  margin: 2px 2px 22px 2px;
  transition: padding 0.2s, margin 0.2s;
  --border-radius: 13px;
  --color: #ffffff20;
}

.border-container:hover {
  padding: 5px;
  margin: 0 0 20px 0;
  --border-radius: 15px;
}

.background {
  display: flex;
  flex-wrap: wrap;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.background-color {
  flex: 1 0 45%;
  transition: background-color 0.3s ease, border-radius 0.3s ease;
}

.background-color.tr {
  background-color: var(--color);
  border-top-right-radius: var(--border-radius);
}

.background-color.tl {
  background-color: var(--color);
  border-top-left-radius: var(--border-radius);
}

.background-color.br {
  background-color: var(--color);
  border-bottom-right-radius: var(--border-radius);
}

.background-color.bl {
  background-color: var(--color);
  border-bottom-left-radius: var(--border-radius);
}
</style>