<script setup lang="ts">

defineProps<{
  modelValue: string
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>();

function onInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
}
</script>

<template>
  <input
    class="app-input"
    :value="modelValue"
    @input="onInput"
    v-bind="$attrs">
</template>

<style scoped>
.app-input {
  padding: 10px;
  border: none;
  border-radius: 8px;
  outline: none;
  font-size: 20px;
  color: #fff;
  transition: background-color 0.3s ease;
  background-color: #f0f0f033;
  text-align: center;
  text-transform: lowercase;
}
</style>