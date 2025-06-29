<script setup lang="ts">
import ColoredBorder from './ColoredBorder.vue';

defineOptions({ inheritAttrs: false });
defineProps(['type']);

</script>

<template>
  <ColoredBorder :type="type">
    <button
      class="button"
      v-bind="$attrs">
      <slot></slot>
    </button>
  </ColoredBorder>
</template>

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
  transition: background-color 0.3s ease;
  z-index: 5;
}

.button:hover {
  background-color: #0A4B7A;
}
</style>