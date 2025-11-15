import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetRoomsQuery } from "@rooms/application/queries/get-rooms.query";
import { Room } from "@rooms/domain/entities/rooms.entity";
import type { RoomRepository } from "@rooms/domain/ports/room-repository.port";

@QueryHandler(GetRoomsQuery)
export class GetRoomsHandler implements IQueryHandler<GetRoomsQuery> {
  constructor(
    @Inject('RoomRepository') private readonly roomRepository: RoomRepository,
  ) { }

  async execute(query: GetRoomsQuery): Promise<Room[]> {
    return this.roomRepository.findAll();
  }
}