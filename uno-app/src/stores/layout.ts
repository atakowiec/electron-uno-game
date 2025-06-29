import { defineStore } from 'pinia';

export type LayoutState = {
  state: 'menu' | 'lobby' | 'game'
}

export const useLayoutStore = defineStore('layout', {
  state: (): LayoutState => ({
    state: 'menu',
  }),
  actions: {
    setState(newState: LayoutState['state']) {
      this.state = newState;
    },
  },
  getters: {
    isMenu: (state) => state.state === 'menu',
    isLobby: (state) => state.state === 'lobby',
    isGame: (state) => state.state === 'game',
  },
});
