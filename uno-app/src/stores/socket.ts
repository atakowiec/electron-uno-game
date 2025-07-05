import { defineStore } from 'pinia';
import { io, type Socket } from 'socket.io-client';
import type { ClientToServerEvents, ClientToServerEventTypes, ServerToClientEvents } from '@shared/socket';

export type SocketState = {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null
}

export type Params<T> = T extends (...args: infer P) => any ? P : never;

export const useSocketStore = defineStore('socket', {
  state: (): SocketState => ({
    socket: null,
  }),
  actions: {
    connect() {
      if (this.socket) {
        console.warn('Socket is already connected:', this.socket.id);
        return;
      }

      this.socket = io('http://localhost:3000');

      this.socket.on('connect', () => {
        console.log('Socket connected:', this.socket?.id);
      });

      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
        this.socket = null;
      });
    },

    emit<E extends ClientToServerEventTypes>(event: E, ...args: Params<ClientToServerEvents[E]>) {
      this.socket?.emit(event, ...args);
    },
  },
});
