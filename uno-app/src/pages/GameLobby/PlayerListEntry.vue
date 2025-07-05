<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { PlayerPacket } from '@shared/game';

defineProps<{
  player: PlayerPacket;
  index: number;
}>()
</script>

<template>
  <li>
    <div class="number">
      {{ index + 1 }}.
    </div>
    <div class="name">
      {{ player.username}}
    </div>
    <div class="right">
      <div class="crown-icon" v-if="player.owner">
        <font-awesome-icon icon="crown" />
      </div>
    </div>
  </li>
</template>

<style scoped>
li {
  display: flex;
  align-items: center;
  padding: 5px 20px;
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
</style>