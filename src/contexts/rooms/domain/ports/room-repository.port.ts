import { Room } from "../entities/rooms.entity";

export interface RoomRepository {
  save(room: Room): Promise<Room>;
  findAll(): Promise<Room[]>;
  findById(id: string): Promise<Room | null>;
  updateParticipants(roomId: string, participants: string[]): Promise<Room>;
  findParticipantInRoom(roomId: string, participantId: string): Promise<boolean>;
}