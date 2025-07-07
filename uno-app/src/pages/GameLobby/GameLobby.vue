<script setup lang="ts">

import AppButton from '../../components/AppButton.vue';
import PlayerListEntry from './PlayerListEntry.vue';
import { useGameStore } from '../../stores/game.ts';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useSocketStore } from '../../stores/socket.ts';
import { ref } from 'vue';
import ConfirmationModal from '../../components/ConfirmationModal.vue';
import { toast } from 'vue3-toastify';

const gameStore = useGameStore();
const socketStore = useSocketStore();

const leaveShown = ref(false);

if (!gameStore.game) {
  throw new Error('Game store is not initialized');
}

function leaveGameClick() {
  socketStore.emit('leaveGame');
}

function startGame() {
  if (!gameStore.isOwner) {
    return;
  }

  if (gameStore.game?.players.some(p => !p.connected)) {
    toast.error('All players must be connected to start the game.');
    return;
  }

  socketStore.emit('startGame');
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
        <PlayerListEntry v-for="(player, i) in gameStore.game?.players"
                         :key="player.username"
                         :player="player"
                         :index="i" />
      </ul>
      <div class="buttons">
        <AppButton type="colored"
                   v-if="gameStore.isOwner"
                   @click="startGame">
          Start Game
        </AppButton>
        <AppButton type="secondary" @click="leaveShown = true">
          Leave Lobby
        </AppButton>
        <AppButton type="secondary" button-style="padding: 10px 15px;" v-if="gameStore.isOwner">
          <FontAwesomeIcon icon="gear" />
        </AppButton>
      </div>
    </div>
  </div>
  <ConfirmationModal title="Confirmation"
                     v-model:shown="leaveShown"
                     :on-confirm="leaveGameClick">
    <p>
      Are you sure you want to leave the lobby?
    </p>
    <p v-if="gameStore.isOwner">
      The ownership will be given to the next player.
    </p>
  </ConfirmationModal>
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
  margin-bottom: 20px;
}

.game-code {
  font-size: 1.2rem;
  margin-top: -5px;
  opacity: .7;
  letter-spacing: 1px;
}
</style>