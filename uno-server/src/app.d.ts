import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from '@shared/socket';
import { Socket } from 'socket.io';

export type ClientSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
