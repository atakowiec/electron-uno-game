import { GamePacket, PartialGamePacket } from './game';
import { Notification } from './notifications';

export interface ServerToClientEvents {
  setGame: (gamePacket: GamePacket | null) => void;
  updateGame: (gamePacket: PartialGamePacket) => void;
  notification: (notification: Notification) => void;
}

export interface ClientToServerEvents {
  createGame: (username: string) => void;
  checkGameId: (gameId: string, cb: (exist: bool) => void) => void;
  joinGame: (gameId: string, username: string) => void;
  leaveGame: () => void;
  kickPlayer: (username: string) => void;
  startGame: () => void;
}

export type ClientToServerEventTypes = keyof ClientToServerEvents;

export interface InterServerEvents {

}

export interface SocketData {
  username?: string;
}