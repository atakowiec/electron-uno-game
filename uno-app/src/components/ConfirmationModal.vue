<script setup lang="ts">
import Modal from './Modal.vue';
import AppButton from './AppButton.vue';
import { computed } from 'vue';

const props = defineProps<{
  shown: boolean;
  title: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}>();

const emit = defineEmits(['update:shown']);

const model = computed({
  get: () => props.shown,
  set: (value: boolean) => emit('update:shown', value),
});

function fireCancel() {
  props.onCancel?.();
  model.value = false;
}
</script>

<template>
  <Modal v-model:shown="model">
    <h1>
      {{ title }}
    </h1>
    <slot></slot>
    <div class="buttons">
      <AppButton @click="onConfirm" type="colored">
        {{ confirmText || 'Confirm' }}
      </AppButton>
      <AppButton @click="fireCancel" type="secondary">
        {{ cancelText || 'Cancel' }}
      </AppButton>
    </div>
  </Modal>
</template>

<style scoped>
.buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 40px;
}
</style>