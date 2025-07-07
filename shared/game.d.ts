export interface GamePacket {
  gameId: string;
  player: PlayerPacket
  players: PlayerPacket[];
  status: GameStatus;
  stack: Card[],
  deck: Card[],
  playerHand: Card[],
  otherHands: PlayerHand[],
}

export type PlayerHand = {
  username: string;
  cards: Card[];
}

export type GameStatus = 'waiting' | 'playing' | 'finished';

export type PartialGamePacket = Partial<GamePacket>;

export interface PlayerPacket {
  username: string;
  owner: boolean;
  connected: boolean;
}

export type Card = {
  id: number,
  card_id?: string,
}