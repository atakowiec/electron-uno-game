<script setup lang="ts">
import { ref } from 'vue';

const cardCount = ref(52);
</script>

<template>
  <div
    class="deck"
    :style="`top: calc(50% - ${cardCount*2}px)`">
    <img v-for="i in cardCount"
         src="/cards/card_back.png"
         :key="i"
         :style="{
            top: `${i*2}px`,
            zIndex: 100-i
          }"
         alt="card back">
  </div>
</template>

<style scoped>
.deck {
  position: fixed;

  img {
    position: absolute;
    height: 24vh;
    transform: rotateZ(-26.666deg) rotateX(-60deg) rotateY(-30deg);
    border: 1px solid #888;
    border-radius: 10%;
  }
}
</style>