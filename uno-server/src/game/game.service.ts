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
    this.games[gameId] = new Game(this, gameId, socket);
    console.log(`Game created with ID: ${gameId}`);
  }

  joinGame(socket: ClientSocket, gameId: string) {
    const game = this.getGame(gameId);
    if (!game) {
      console.warn(`Game with ID ${gameId} does not exist.`);
      return;
    }

    game.join(socket);
  }

  getGameBySocket(socket: ClientSocket) {
    for (const game of Object.values(this.games)) {
      if (game.hasPlayer(socket.data.username)) {
        return game;
      }
    }
    return undefined;
  }

  handleDisconnect(socket: ClientSocket) {
    const game = this.getGameBySocket(socket);
    if (!game) return;

    game.handlePlayerDisconnect(socket);
  }

  removeGame(gameId: string) {
    const game = this.getGame(gameId);
    if (!game) return;

    // Notify players before removing the game
    game.players.forEach((player) => {
      player.sendNotification('info', 'The game has been removed.');
    });

    delete this.games[gameId];
    console.log(`Game with ID ${gameId} has been removed.`);
  }

  leaveGame(socket: ClientSocket) {
    const game = this.getGameBySocket(socket);
    if (game) {
      game.leave(socket);
    }

    socket.emit('setGame', null);
  }

  kickPlayer(socket: ClientSocket, username: string) {
    const game = this.getGameBySocket(socket);
    if (!game) {
      console.warn(`No game found for socket ${socket.id}`);
      return;
    }

    if (!game.hasPlayer(username)) {
      console.warn(`Player ${username} not found in game ${game.id}`);
      return;
    }

    if (game.owner.username !== socket.data.username) {
      console.warn(`Player ${socket.data.username} is not the owner of game ${game.id}`);
      return;
    }

    game.kickPlayer(username);
  }
}
