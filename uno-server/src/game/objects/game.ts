import { ClientSocket } from '../../app';
import GamePlayer from './game-player';
import { GamePacket, PartialGamePacket } from '@shared/game';

export class Game {
  public owner: GamePlayer;
  public players: GamePlayer[];

  constructor(
    public id: string,
    owner: ClientSocket,
  ) {
    this.owner = new GamePlayer(owner, true);
    this.players = [this.owner];

    this.sendGamePacket(owner);
  }

  public sendGamePacket(socket: ClientSocket): void {
    const player = this.getPlayerBySocket(socket);

    if (!player) {
      console.warn(`Player not found for socket ${socket.id}`);
      return;
    }

    socket.emit('setGame', this.getPacket(player));
  }

  public broadcastUpdate(update: PartialGamePacket): void {
    this.players.forEach((player) => {
      player.socket.emit('updateGame', update);
    });
  }

  private getPlayerBySocket(socket: ClientSocket): GamePlayer | undefined {
    return this.players.find((player) => player.socket.id === socket.id);
  }

  public join(socket: ClientSocket) {
    if (this.players.length >= 4) {
      console.warn(`Game ${this.id} is full. Cannot join.`);
      return;
    }

    const newPlayer = new GamePlayer(socket);
    this.players.push(newPlayer);

    this.sendGamePacket(socket);
    this.broadcastUpdate({
      players: this.players.map((player) => player.getPacket()),
    });
    console.log(`Player ${newPlayer.username} joined game ${this.id}`);
  }

  private getPacket(forPlayer: GamePlayer): GamePacket {
    return {
      gameId: this.id,
      player: forPlayer.getPacket(),
      players: this.players.map((player) => player.getPacket()),
      status: 'waiting',
    };
  }
}
