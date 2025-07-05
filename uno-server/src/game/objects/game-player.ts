import { ClientSocket } from '../../app';
import { PlayerPacket } from '@shared/game';

export default class GamePlayer {
  constructor(
    public socket: ClientSocket,
    public owner: boolean = false,
  ) {}

  get username(): string {
    return this.socket.data.username || 'Unknown';
  }

  getPacket(): PlayerPacket {
    return {
      username: this.socket.data.username!,
      owner: this.owner,
    };
  }
}
