<script setup lang="ts">

import Button from '../../components/Button.vue';
import PlayerListEntry from './PlayerListEntry.vue';
import { reactive } from 'vue';

const players = reactive([
  { id: 1, name: 'Player 1', owner: true },
  { id: 2, name: 'Player 2' },
  { id: 3, name: 'Player 3' },
  { id: 4, name: 'Player 4' },
]);
</script>

<template>
  <div class="container">
    <img src="/uno-logo.png" alt="logo" class="logo">
    <div class="page-box">
      <h1>Game Lobby</h1>
      <div class="game-code">
        #a5v3a
      </div>
      <ul class="player-list">
        <PlayerListEntry v-for="(player, i) in players" :key="player.id" :player="player" :index="i" />
      </ul>
      <div class="buttons">
        <Button type="colored">Start Game</Button>
        <Button type="secondary">Leave Lobby</Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
h1 {
  margin-bottom: -5px;
}

.player-list {
  list-style: none;
  width: 100%;
  padding: 0;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
  align-items: flex-start;
}
</style>