<template>
  <GameMenu v-if="layoutStore.state === 'menu'" />
  <GameLobby v-if="layoutStore.state === 'lobby'" />
  <Game v-if="layoutStore.state === 'game'" />
</template>

<script setup lang="ts">
import { useLayoutStore } from './stores/layout.js';
import GameMenu from './pages/GameMenu/GameMenu.vue';
import GameLobby from './pages/GameLobby/GameLobby.vue';
import Game from './pages/Game/Game.vue';

const layoutStore = useLayoutStore();
</script>