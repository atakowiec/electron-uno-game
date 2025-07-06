<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { PlayerPacket } from '@shared/game';
import { useGameStore } from '../../stores/game.ts';
import AppButton from '../../components/AppButton.vue';
import { useSocketStore } from '../../stores/socket.ts';

const props = defineProps<{
  player: PlayerPacket;
  index: number;
}>();

const gameStore = useGameStore();
const socketStore = useSocketStore();

function kickPlayer() {
  if (!gameStore.game) return;

  socketStore.emit('kickPlayer', props.player.username);
}
</script>

<template>
  <li>
    <div class="number">
      {{ index + 1 }}.
    </div>
    <div class="name">
      {{ player.username }}
      <span class="player-status" v-if="!player.connected">
        offline
      </span>
    </div>
    <div class="right">
      <div class="crown-icon" v-if="player.owner">
        <font-awesome-icon icon="crown" />
      </div>
      <div class="crown-icon" v-if="!player.owner && gameStore.game?.player.owner">
        <AppButton type="secondary" size="small" @click="kickPlayer">
          <font-awesome-icon icon="remove" />
        </AppButton>
      </div>
    </div>
  </li>
</template>

<style scoped>
li {
  display: flex;
  align-items: center;
  padding: 5px 5px 5px 20px;
  border-bottom: 1px solid #aaa;
  gap: 5px;
}

.number {
  width: 20px;
  opacity: 0.7;
  user-select: none;
}

.name {
  flex: 1;
}

.right {
  min-height: 30px;
}

.crown-icon {
  height: 42px;
  width: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.player-status {
  font-size: 0.8rem;
  margin-left: 5px;
  background: #DE4652;
  padding: 2px 7px;
  border-radius: 5px;
  color: #eee;
}
</style>