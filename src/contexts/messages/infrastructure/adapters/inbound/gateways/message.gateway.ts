import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { MessageResponseDto } from '../dto/message-response.dto';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173'],
    credentials: false,
  },
  namespace: '/messages',
})
export class MessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(MessageGateway.name);

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`room:${roomId}`);
    this.logger.log(`Client ${client.id} joined room: ${roomId}`);
    return { event: 'joinedRoom', data: { roomId } };
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(`room:${roomId}`);
    this.logger.log(`Client ${client.id} left room: ${roomId}`);
    return { event: 'leftRoom', data: { roomId } };
  }

  notifyNewMessage(roomId: string, message: MessageResponseDto) {
    this.logger.log(`Emitting new message to room: ${roomId}`);
    this.server.to(`room:${roomId}`).emit('newMessage', message);
  }
}
