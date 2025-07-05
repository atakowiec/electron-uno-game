import { ClientSocket } from '../../app';
import { PlayerPacket } from '@shared/game';
import { NotificationType } from '@shared/notifications';

export default class GamePlayer {
  public removeTimeout: NodeJS.Timeout | null = null;

  constructor(
    public socket: ClientSocket,
    public owner: boolean = false,
  ) {}

  get username(): string {
    return this.socket.data.username || 'Unknown';
  }

  get connected(): boolean {
    return this.socket.connected;
  }

  getPacket(): PlayerPacket {
    return {
      username: this.socket.data.username!,
      owner: this.owner,
      connected: this.socket.connected,
    };
  }

  sendNotification(type: NotificationType, message: string): void {
    this.socket.emit('notification', {
      type,
      message,
    });
  }

  clearRemoveTimeout() {
    if (this.removeTimeout) {
      clearTimeout(this.removeTimeout);
      this.removeTimeout = null;
    }
  }
}
