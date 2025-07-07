import { ClientSocket } from '../../app';
import GamePlayer from './game-player';
import { Card, GamePacket, GameStatus, PlayerHand } from '@shared/game';
import { GameService } from '../game.service';
import { blindCards, pickFields, shuffle } from '../../app.util';
import { NotificationType } from '@shared/notifications';
import { cardsData } from './cards-data';

export class Game {
  public owner: GamePlayer;
  public players: GamePlayer[];
  public status: GameStatus = 'waiting';

  public deck: Card[] = [];
  public stack: Card[] = [];

  constructor(
    public gameService: GameService,
    public id: string,
    owner: ClientSocket,
  ) {
    this.owner = new GamePlayer(owner, true);
    this.players = [this.owner];

    this.sendGamePacket(owner);

    this.deck = shuffle(
      Object.keys(cardsData).map(
        (card_id, i): Card => ({
          id: i,
          card_id: card_id,
        }),
      ),
    );
  }

  public sendGamePacket(socket: ClientSocket): void {
    const player = this.getPlayerBySocket(socket);

    if (!player) {
      console.warn(`Player not found for socket ${socket.id}`);
      return;
    }

    socket.emit('setGame', this.getPacket(player));
  }

  public broadcastUpdate(updateFields: (keyof GamePacket)[]): void {
    this.players.forEach((player) => {
      const packet = this.getPacket(player);
      const updatePacket = pickFields(packet, updateFields);
      player.socket.emit('updateGame', updatePacket);
    });
  }

  public broadcastNotification(type: NotificationType, message: string): void {
    this.players.forEach((player) => {
      player.sendNotification(type, message);
    });
  }

  private getPlayerBySocket(socket: ClientSocket): GamePlayer | undefined {
    return this.players.find((player) => player.socket.id === socket.id);
  }

  private getPlayerByUsername(username: string): GamePlayer | undefined {
    return this.players.find((player) => player.username === username);
  }

  public join(socket: ClientSocket) {
    const player = this.getPlayerByUsername(socket.data.username!);

    console.log(`Player ${socket.data.username} is trying to join game ${this.id}`);

    if (player?.connected) {
      console.log(`Player ${player.username} is already connected to game ${this.id}`);
      socket.emit('notification', {
        type: 'error',
        message: 'This username is already taken in the game.',
      });
      return;
    }

    let newPlayer = player;
    if (player) {
      // If the player is already in the game but disconnected, reconnect them
      player.socket = socket;
      player.clearRemoveTimeout();
      console.log(`Reconnected player ${player.username} to game ${this.id}`);
    } else {
      if (this.players.length >= 4) {
        console.log(`Game ${this.id} is full. Cannot add player ${socket.data.username}`);
        socket.emit('notification', {
          type: 'error',
          message: 'Game is full. You cannot join.',
        });
        return;
      }

      console.log(`Adding new player ${socket.data.username} to game ${this.id}`);
      newPlayer = new GamePlayer(socket);
      this.players.push(newPlayer);
    }

    this.sendGamePacket(socket);
    this.broadcastUpdate(['players']);

    for (const otherPlayer of this.players) {
      const action = player === newPlayer ? 'reconnected' : 'joined';
      if (otherPlayer !== newPlayer) {
        otherPlayer.sendNotification('info', `${newPlayer!.username} has ${action} the game.`);
      } else {
        otherPlayer.sendNotification('info', `You have ${action} the game.`);
      }
    }
  }

  private getPacket(forPlayer: GamePlayer): GamePacket {
    return {
      gameId: this.id,
      player: forPlayer.getPacket(),
      players: this.players.map((player) => player.getPacket()),
      status: this.status,
      stack: this.stack,
      deck: blindCards(this.deck),
      playerHand: forPlayer.getHand(true),
      otherHands: this.getOpponentsHands(forPlayer),
    };
  }

  /**
   * Returns the hands of all opponents, with cards blinded. In order based on the player's position.
   * @param forPlayer The player for whom the opponents' hands are being requested.
   * @private
   */
  private getOpponentsHands(forPlayer: GamePlayer): PlayerHand[] {
    let index = this.players.indexOf(forPlayer);
    index = (index + 1) % this.players.length; // Start from the next player

    const opponentsHands: PlayerHand[] = [];
    for (let i = 0; i < this.players.length - 1; i++) {
      const opponent = this.players[index];
      opponentsHands.push({
        username: opponent.username,
        cards: blindCards(opponent.getHand()),
      });
      index = (index + 1) % this.players.length; // Move to the next player
    }

    return opponentsHands;
  }

  hasPlayer(username?: string) {
    if (!username) {
      return false;
    }

    return this.players.some((player) => player.username === username);
  }

  handlePlayerDisconnect(socket: ClientSocket) {
    const player = this.getPlayerBySocket(socket);

    if (!player) {
      return;
    }

    if (player.removeTimeout) {
      clearTimeout(player.removeTimeout);
    }

    console.log(`Setting remove timeout for player ${player.username} in game ${this.id}`);

    player.removeTimeout = setTimeout(() => {
      this.forceRemovePlayer(player);
    }, 30_000); // 30-second timeout

    this.broadcastUpdate(['players']);
  }

  private forceRemovePlayer(player: GamePlayer) {
    const index = this.players.indexOf(player);
    if (index === -1) {
      console.warn(`Player ${player.username} not found in game ${this.id}`);
      return;
    }

    player.socket.volatile.emit('setGame', null);

    this.players.splice(index, 1);
    player.clearRemoveTimeout();

    if (this.players.length === 0) {
      console.log(`Game ${this.id} has no players left and will be deleted.`);
      this.gameService.removeGame(this.id);
      return;
    } else if (player.owner) {
      // If the owner is removed, transfer ownership to the next player
      this.findNewOwner();
    }

    this.broadcastUpdate(['player', 'players']);

    console.log(`Player ${player.username} has been removed from game ${this.id}`);
  }

  private findNewOwner() {
    if (this.players.length === 0) {
      console.warn(`No players left in game ${this.id} to transfer ownership.`);
      return;
    }

    const newOwner = this.players[0];
    newOwner.owner = true;
    this.owner = newOwner;

    console.log(`Player ${newOwner.username} is now the owner of game ${this.id}`);
  }

  leave(socket: ClientSocket) {
    const player = this.getPlayerBySocket(socket);
    if (!player) return;

    this.forceRemovePlayer(player);
    this.broadcastNotification('info', `${player.username} has left the game.`);

    if (player.owner) {
      this.findNewOwner();
      this.broadcastNotification('info', `${this.owner.username} has taken ownership of the game.`);
    }

    this.broadcastUpdate(['players']);
  }

  kickPlayer(username: string) {
    const player = this.getPlayerByUsername(username);
    if (!player) {
      console.warn(`Player ${username} not found in game ${this.id}`);
      return;
    }

    if (player.owner) {
      console.warn(`Cannot kick owner ${this.owner.username} from game ${this.id}`);
      return;
    }

    console.log(`Kicking player ${player.username} from game ${this.id}`);
    this.forceRemovePlayer(player);
    this.broadcastNotification('warning', `${player.username} has been kicked from the game.`);
    player.sendNotification('warning', 'You have been kicked from the game.');
    player.socket.volatile.emit('setGame', null);

    this.broadcastUpdate(['players']);
  }

  public start() {
    if (this.players.length < 2) {
      console.warn(`Cannot start game ${this.id} with less than 2 players.`);
      this.owner.sendNotification('error', 'Cannot start the game with less than 2 players.');
      return;
    }

    this.broadcastNotification('info', 'The game is starting!');
    this.status = 'playing';

    this.giveCardsToPlayers();
    this.broadcastUpdate(['status', 'deck', 'stack', 'playerHand', 'otherHands']);

    // Additional logic for starting the game can be added here
    console.log(`Game ${this.id} has started with players: ${this.players.map((p) => p.username).join(', ')}`);
  }

  private giveCardsToPlayers() {
    const cardsPerPlayer = 7;
    for (const player of this.players) {
      player.hand = this.deck.splice(0, cardsPerPlayer);
      player.clearRemoveTimeout();
    }

    // for test purposes, we can give the first 7 cards to the stack - to test displaying cards
    if (this.deck.length > 0) {
      this.stack.push(...this.deck.splice(0, 7));
    }
  }
}
