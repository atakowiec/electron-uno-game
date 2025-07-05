import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import {
  ClientToServerEvents,
  ClientToServerEventTypes,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from '@shared/socket';
import { Server } from 'socket.io';
import { GameService } from './game.service';
import { ClientSocket } from '../app';
import * as console from 'node:console';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173'],
  },
})
export class GameGateway {
  @WebSocketServer()
  server: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

  constructor(private readonly gameService: GameService) {
    // empty
  }

  @SubscribeMessage<ClientToServerEventTypes>('checkGameId')
  handleCheckGameId(@MessageBody() gameId: string) {
    return this.gameService.gameExists(gameId);
  }

  @SubscribeMessage<ClientToServerEventTypes>('createGame')
  handleCreateGame(@ConnectedSocket() socket: ClientSocket, @MessageBody() username: string) {
    console.log('Creating game with username:', username);
    socket.data.username = username;
    this.gameService.createGame(socket);
  }

  @SubscribeMessage<ClientToServerEventTypes>('joinGame')
  handleJoinGame(
    @ConnectedSocket() socket: ClientSocket,
    @MessageBody('1') gameId: string,
    @MessageBody('0') username: string,
  ) {
    console.log('Joining game with ID:', gameId, 'and username:', username);
    socket.data.username = username;
    this.gameService.joinGame(socket, gameId);
  }
}
