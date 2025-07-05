<script setup lang="ts">

import AppButton from '../../components/AppButton.vue';
import PlayerListEntry from './PlayerListEntry.vue';
import { useGameStore } from '../../stores/game.ts';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const gameStore = useGameStore();

if (!gameStore.game) {
  throw new Error('Game store is not initialized');
}
</script>

<template>
  <div class="container">
    <img src="/uno-logo.png" alt="logo" class="logo">
    <div class="page-box">
      <h1>Game Lobby</h1>
      <div class="game-code">
        #{{ gameStore.game?.gameId }}
      </div>
      <ul class="player-list">
        <PlayerListEntry v-for="(player, i) in gameStore.game?.players" :key="player.username" :player="player" :index="i" />
      </ul>
      <div class="buttons">
        <AppButton type="colored">Start Game</AppButton>
        <AppButton type="secondary">Leave Lobby</AppButton>
        <AppButton type="secondary" button-style="padding: 10px 15px;">
          <FontAwesomeIcon icon="gear" />
        </AppButton>
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
  gap: 10px;
  margin-top: 20px;
  align-items: flex-start;
}

.game-code {
  font-size: 1.2rem;
  margin-top: -5px;
  opacity: .7;
  letter-spacing: 1px;
}
</style>