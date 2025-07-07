<script setup lang="ts">

import Deck from './Deck.vue';
import MainStack from './MainStack.vue';
import HandCards from './HandCards.vue';
</script>

<template>
  <div class="game-container">
    <Deck />
    <MainStack />
    <HandCards />
  </div>
</template>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
</style>