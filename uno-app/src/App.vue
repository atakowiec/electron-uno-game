<script setup lang="ts">
import GameMenu from './pages/GameMenu/GameMenu.vue';
import GameLobby from './pages/GameLobby/GameLobby.vue';
import { useSocketStore } from './stores/socket.ts';
import { toRef, watch } from 'vue';
import { useGameStore } from './stores/game.ts';
import { toast } from 'vue3-toastify';
import Game from './pages/Game/Game.vue';

const socketStore = useSocketStore();
const gameStore = useGameStore();

watch(toRef(socketStore, 'socket'), (socket) => {
  if (!socket) return;

  socket.on('setGame', gameStore.setGame);
  socket.on('updateGame', gameStore.updateGame);
  socket.on('notification', (n) => toast[n.type](n.message));

  const gameId = localStorage.getItem('game_id');
  const username = localStorage.getItem('game_username');
  if (gameId && username) {
    localStorage.removeItem('game_id');
    localStorage.removeItem('game_username');
    socket.emit('joinGame', username, gameId);
  }
});

socketStore.connect();

</script>

<template>
  <GameMenu v-if="!gameStore.game?.gameId" />
  <GameLobby v-if="gameStore.game?.status === 'waiting'" />
  <Game v-if="gameStore.game?.status === 'playing'" />
</template>