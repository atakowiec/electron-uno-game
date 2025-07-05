import { defineStore } from 'pinia';
import { GamePacket, PartialGamePacket } from '@shared/game';

interface GameStore {
  game: GamePacket | null;
}

export const useGameStore = defineStore('game', {
  state: (): GameStore => ({
    game: null,
  }),
  actions: {
    setGame(gamePacket: GamePacket) {
      console.log('Saving game packet:', gamePacket);

      this.game = gamePacket;
    },
    updateGame(gamePacket: PartialGamePacket) {
      if (!this.game) {
        console.warn('No game to update');
        return;
      }

      // Update the existing game packet with the new data
      this.game = { ...this.game, ...gamePacket };
    },
  },
  getters: {},
});
