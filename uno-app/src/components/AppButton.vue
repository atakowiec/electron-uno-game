<script setup lang="ts">
import ColoredBorder, { ButtonType } from './ColoredBorder.vue';

defineOptions({ inheritAttrs: false });
defineProps<{
  type: ButtonType
  buttonStyle?: string
}>();

</script>

<template>
  <ColoredBorder :type="type" :style="$attrs.style || ''">
    <button
      :class="`button ${type === 'disabled' ? ' disabled' : ''}`"
      :style="buttonStyle ?? ''"
      v-bind="{...$attrs, style: ''}">
      <slot></slot>
    </button>
  </ColoredBorder>
</template>

<!--suppress CssUnusedSymbol -->
<style scoped>
.button {
  border: none;
  padding: 10px 35px;
  font-size: 1rem;
  border-radius: 10px;
  background-color: #0D5A94;
  color: white;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s ease, opacity 0.3s ease;
  z-index: 5;

  &.disabled {
    cursor: default;
    color: #ffffff40;
    background-color: #0D5A94;
    opacity: .8;
  }

  &.disabled:hover {
    background-color: #0D5A94;
    opacity: .7;
  }
}

.button:hover {
  background-color: #0A4B7A;
}
</style>