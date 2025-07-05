<script setup lang="ts">
import AppButton from '../../components/AppButton.vue';
import CodeInput from './CodeInput.vue';
import { reactive, ref, watch } from 'vue';
import Modal from '../../components/Modal.vue';
import AppInput from '../../components/AppInput.vue';
import { useSocketStore } from '../../stores/socket.ts';

const otp = reactive(['', '', '', '', '']);
const otpError = ref<string | null>(' ');

const modalShown = ref(false);
const nameRef = ref<string>('');
const action = ref<null | 'join' | 'create'>(null);

const socketStore = useSocketStore();

function createNewGameClick() {
  modalShown.value = true;
  action.value = 'create';
}

function joinLobbyClick() {
  if (!validateOtp()) return;

  socketStore.emit('checkGameId', otp.join('').toLowerCase(), (exists: boolean) => {
    if (!exists) {
      otpError.value = 'Game does not exist';
      return;
    }

    otpError.value = null;
    modalShown.value = true;
    action.value = 'join';
  });
}

watch(otp, () => {
  otpError.value = ' ';
  if (!validateOtp()) {
    return;
  }

  socketStore.emit('checkGameId', otp.join('').toLowerCase(), (exists: boolean) => {
    if (!exists) {
      otpError.value = 'Game does not exist';
      return;
    }

    otpError.value = null;
  });
});

function validateOtp(): boolean {
  const regex = /^[a-z0-9]{5}$/;
  return regex.test(otp.join('').toLowerCase());
}

function onModalAction() {
  if (action.value === 'create') {
    socketStore.emit('createGame', nameRef.value);
  } else if (action.value === 'join') {
    socketStore.emit('joinGame', nameRef.value, otp.join('').toLowerCase());
  }
  modalShown.value = false;
}
</script>

<template>
  <div class="container">
    <img src="/uno-logo.png" alt="logo" class="logo">
    <div class="page-box">
      <h1>Game Menu</h1>
      <AppButton @click="createNewGameClick" type="colored">Create new game</AppButton>
      <div class="or">
        or
      </div>
      <CodeInput :otp="otp" :error="!!otpError && otpError != ' '" />
      <div class="error-message">
        {{ otpError }}
      </div>
      <AppButton @click="joinLobbyClick" :type="!otpError ? 'colored' : 'disabled'">Join Lobby</AppButton>
    </div>
  </div>
  <Modal v-model:shown="modalShown">
    <h1>
      Set your nickname
    </h1>
    <form @submit.prevent="onModalAction">
      <AppInput v-model="nameRef" type="text" />
      <AppButton type="colored" style="margin-top: 50px;">
        {{ action === 'create' ? 'Create Game' : 'Join Lobby' }}
      </AppButton>
    </form>
  </Modal>
</template>

<style scoped>
.or {
  margin: 20px 0 20px 0;
  color: white;
  font-size: 18px;
}

.error-message {
  opacity: .9;
  font-size: 14px;
  padding-bottom: 10px;
  padding-top: 10px;
  height: 22px;
}
</style>