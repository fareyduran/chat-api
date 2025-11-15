import { Room } from "src/contexts/rooms/domain/entities/rooms.entity";

export class RoomResponseDto {
  id: string;
  name: string;
  createdBy: string;
  participants: string[];
  createdAt: Date;

  static fromDomain(room: Room): RoomResponseDto {
    const dto = new RoomResponseDto();
    const roomJson = room.toJson();
    dto.id = roomJson.id;
    dto.name = roomJson.name;
    dto.createdBy = roomJson.createdBy;
    dto.participants = roomJson.participants;
    dto.createdAt = roomJson.createdAt;
    return dto;
  }
}