<script setup lang="ts">
import GameMenu from './pages/GameMenu/GameMenu.vue';
import GameLobby from './pages/GameLobby/GameLobby.vue';
import { useSocketStore } from './stores/socket.ts';
import { toRef, watch } from 'vue';
import { useGameStore } from './stores/game.ts';

const socketStore = useSocketStore();
const gameStore = useGameStore();

watch(toRef(socketStore, 'socket'), (socket) => {
  if (!socket) return;

  socket.on('setGame', gameStore.setGame);
  socket.on('updateGame', gameStore.updateGame);
});

socketStore.connect();

</script>

<template>
  <GameMenu v-if="!gameStore.game?.gameId" />
  <GameLobby v-if="!!gameStore.game?.gameId" />
  <!--  <Game v-if="layoutStore.state === 'game'" />-->
</template>