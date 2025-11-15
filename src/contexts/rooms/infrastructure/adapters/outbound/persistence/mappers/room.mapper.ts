import { Room } from "@rooms/domain/entities/rooms.entity";
import { RoomSchema } from "../schemas/room.schema";

export class RoomMapper {
  static toDomain(roomSchema: RoomSchema): Room {
    return new Room(
      roomSchema.name,
      roomSchema.createdBy,
      roomSchema.participants,
      roomSchema.createdAt,
      roomSchema._id.toString()
    );
  }
}