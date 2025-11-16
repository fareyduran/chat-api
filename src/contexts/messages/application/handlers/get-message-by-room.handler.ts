import type { MessageRepository } from "@messages/domain/ports/message-repository.port";
import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import type { RoomRepository } from "@rooms/domain/ports/room-repository.port";
import { GetMessagesByRoomQuery } from "@messages/application/queries/get-message-by-room.query";

@QueryHandler(GetMessagesByRoomQuery)
export class GetMessagesByRoomHandler implements IQueryHandler<GetMessagesByRoomQuery> {
  constructor(
    @Inject('RoomRepository')
    private readonly roomRepository: RoomRepository,
    @Inject('MessageRepository')
    private readonly messageRepository: MessageRepository,
  ) { }

  async execute(query: GetMessagesByRoomQuery) {
    const { roomId, cursor, limit } = query;

    const room = await this.roomRepository.findById(roomId);
    if (!room) {
      throw new Error(`Room ${roomId} not found.`);
    }

    return this.messageRepository.findByRoomId(roomId, cursor, limit);
  }
}  