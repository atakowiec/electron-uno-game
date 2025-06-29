<script setup lang="ts">
import Button from '../../components/Button.vue';
import { useLayoutStore } from '../../stores/layout.ts';
import CodeInput from './CodeInput.vue';

const layoutStore = useLayoutStore();

function createNewGame() {
  layoutStore.setState('lobby');
}

function joinLobby() {

}
</script>

<template>
  <div class="container">
    <img src="/uno-logo.png" alt="logo" class="logo">
    <div class="page-box">
      <h1>Game Menu</h1>
      <Button @click="createNewGame" type="colored">Create new game</Button>
      <div class="or">
        or
      </div>
      <CodeInput />
      <Button @click="joinLobby" type="colored">Join Lobby</Button>
    </div>
  </div>
</template>

<style scoped>

.or {
  margin: 0 0 20px 0;
  color: white;
  font-size: 18px;
}
</style>