import { Room } from "../entities/rooms.entity";

export interface RoomRepository {
  save(room: Room): Promise<Room>;
  findAll(page: number, limit: number): Promise<{ rooms: Room[]; total: number }>;
  findByUserId(id: string, page: number, limit: number): Promise<{ rooms: Room[]; total: number }>;
  findById(id: string): Promise<Room | null>;
  updateParticipants(roomId: string, participants: string[]): Promise<Room>;
  findParticipantInRoom(roomId: string, participantId: string): Promise<boolean>;
}