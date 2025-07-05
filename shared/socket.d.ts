import { GamePacket, PartialGamePacket } from './game';

export interface ServerToClientEvents {
  setGame: (gamePacket: GamePacket) => void;
  updateGame: (gamePacket: PartialGamePacket) => void;
}

export interface ClientToServerEvents {
  createGame: (username: string) => void;
  checkGameId: (gameId: string, cb: (exist: bool) => void) => void;
  joinGame: (gameId: string, username: string) => void;
}

export type ClientToServerEventTypes = keyof ClientToServerEvents;

export interface InterServerEvents {

}

export interface SocketData {
  username?: string;
}