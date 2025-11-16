import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Room } from "@rooms/domain/entities/rooms.entity";
import type { RoomRepository } from "@rooms/domain/ports/room-repository.port";
import { GetRoomsByUserIdQuery } from "@rooms/application/queries/get-rooms-by-user-id.query";

@QueryHandler(GetRoomsByUserIdQuery)
export class GetRoomsByUserIdHandler implements IQueryHandler<GetRoomsByUserIdQuery> {
  constructor(
    @Inject('RoomRepository') private readonly roomRepository: RoomRepository,
  ) { }

  async execute(query: GetRoomsByUserIdQuery): Promise<{ rooms: Room[]; total: number }> {
    return this.roomRepository.findByUserId(query.userId, query.page, query.limit);
  }
}