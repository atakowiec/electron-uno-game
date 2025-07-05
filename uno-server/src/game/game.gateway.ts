import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
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
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

  constructor(private readonly gameService: GameService) {
    // empty
  }

  handleConnection(socket: ClientSocket) {
    console.log('Client connected:', socket.id);
  }

  handleDisconnect(socket: ClientSocket) {
    console.log('Client disconnected:', socket.id);

    this.gameService.handleDisconnect(socket);
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
    @MessageBody('0') username: string,
    @MessageBody('1') gameId: string,
  ) {
    console.log('Joining game with ID:', gameId, 'and username:', username);
    socket.data.username = username;
    this.gameService.joinGame(socket, gameId);
  }
}
