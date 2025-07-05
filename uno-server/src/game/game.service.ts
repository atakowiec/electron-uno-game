import { Injectable } from '@nestjs/common';
import { Game } from './objects/game';
import { ClientSocket } from '../app';

@Injectable()
export class GameService {
  readonly games: Record<string, Game> = {};

  getGame(gameId: string): Game | undefined {
    return this.games[gameId];
  }

  gameExists(gameId: string): boolean {
    return !!this.getGame(gameId);
  }

  createGame(socket: ClientSocket) {
    const gameId = Math.random().toString(36).substring(2, 7);
    if (this.gameExists(gameId)) {
      this.createGame(socket); // Retry if the game ID already exists
      return;
    }
    this.games[gameId] = new Game(gameId, socket);
    console.log(`Game created with ID: ${gameId}`);
  }

  joinGame(socket: ClientSocket, gameId: string) {
    const game = this.getGame(gameId);
    if (!game) return;

    game.join(socket);
  }
}
