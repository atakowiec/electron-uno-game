export interface GamePacket {
  gameId: string;
  player: PlayerPacket
  players: PlayerPacket[];
  status: 'waiting' | 'playing' | 'finished';
}

export type PartialGamePacket = Partial<GamePacket>;

export interface PlayerPacket {
  username: string;
  owner: boolean;
}