<script setup lang="ts">

import { nextTick, Reactive, ref } from 'vue';

const { otp } = defineProps<{
  otp: Reactive<string[]>
  error: boolean
}>();
const inputs = ref<HTMLInputElement[]>([]);

function onPaste(event: ClipboardEvent) {
  const paste = event.clipboardData?.getData('text') || '';
  if (!/^[a-zA-Z0-9]{1,5}$/.test(paste)) return;
  event.preventDefault();

  const chars = paste.slice(0, 5).split('');
  chars.forEach((char, i) => otp[i] = char);

  nextTick(() => {
    const lastIndex = chars.length - 1;
    inputs.value[lastIndex]?.focus();
  });
}

function onInput(index: number) {
  if (otp[index].length > 1) otp[index] = otp[index].slice(0, 1);
  if (otp[index] && index < 4) {
    nextTick(() => inputs.value[index + 1]?.focus());
  }
}

function onBackspace(index: number) {
  if (!otp[index] && index > 0) {
    nextTick(() => inputs.value[index - 1]?.focus());
  }
}

function onFocus(index: number) {
  nextTick(() => {
    inputs.value[index]?.select();
  });
}
</script>

<template>
  <div class="code-input-box">
    <input
      v-for="(char, index) in otp"
      :key="index"
      type="text"
      :class="`code-input ${error ? 'error' : ''}`"
      maxlength="1"
      v-model="otp[index]"
      @input="onInput(index)"
      @keydown.backspace="onBackspace(index)"
      @focus="onFocus(index)"
      @paste="onPaste($event)"
      ref="inputs"
    />
  </div>
</template>

<!--suppress CssUnusedSymbol -->
<style scoped>

.code-input-box {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3px;
}

.code-input {
  width: 30px;
  height: 30px;
  padding: 10px;
  border: 1px solid transparent;
  border-radius: 8px;
  outline: none;
  font-size: 20px;
  color: #fff;
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
  background-color: #f0f0f033;
  text-align: center;
  text-transform: lowercase;

  &.error {
    border: 1px solid rgba(255, 89, 89, 0.44);
    color: #ff8791;
    animation: shakeAnimation 0.3s ease-in-out;
  }
}

.code-input-box > div {
  position: relative;
  margin-bottom: 20px;
}

.code-input:hover,
.code-input:focus {
  background-color: #d8d8d855;
}

@keyframes shakeAnimation {
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  50% {
    transform: translateX(5px);
  }
  75% {
    transform: translateX(-5px);
  }
  100% {
    transform: translateX(0);
  }
}
</style>