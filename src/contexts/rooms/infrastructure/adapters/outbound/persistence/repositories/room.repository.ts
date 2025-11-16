import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Room } from "@rooms/domain/entities/rooms.entity";
import { RoomRepository } from "@rooms/domain/ports/room-repository.port";
import { RoomSchema } from "@rooms/infrastructure/adapters/outbound/persistence/schemas/room.schema";
import { Model } from "mongoose";
import { RoomMapper } from "../mappers/room.mapper";

@Injectable()
export class MongooseRoomRepository implements RoomRepository {
  constructor(@InjectModel(RoomSchema.name) private roomModel: Model<RoomSchema>) {
  }

  async save(room: Room): Promise<Room> {
    const createdRoom = await this.roomModel.create(room);

    return RoomMapper.toDomain(createdRoom);
  }

  async findAll(page: number, limit: number): Promise<{ rooms: Room[]; total: number }> {
    const skip = (page - 1) * limit;

    const [rooms, total] = await Promise.all([
      this.roomModel.find().skip(skip).limit(limit).exec(),
      this.roomModel.countDocuments().exec(),
    ]);

    return {
      rooms: rooms.map(RoomMapper.toDomain),
      total,
    };
  }

  async findByUserId(id: string, page: number, limit: number): Promise<{ rooms: Room[]; total: number }> {
    const skip = (page - 1) * limit;

    const [rooms, total] = await Promise.all([
      this.roomModel.find({ participants: id }).skip(skip).limit(limit).exec(),
      this.roomModel.countDocuments({ participants: id }).exec(),
    ]);

    return {
      rooms: rooms.map(RoomMapper.toDomain),
      total,
    };
  }

  async updateParticipants(roomId: string, participants: string[]): Promise<Room> {
    const updatedRoom = await this.roomModel.findByIdAndUpdate(
      roomId,
      { participants },
      { new: true },
    ).exec();

    if (!updatedRoom) {
      throw new Error('Room not found');
    }

    return RoomMapper.toDomain(updatedRoom);
  }

  async findById(id: string): Promise<Room | null> {
    const room = await this.roomModel.findById(id).exec();

    return room ? RoomMapper.toDomain(room) : null;
  }

  async findParticipantInRoom(roomId: string, participantId: string): Promise<boolean> {
    const room = await this.roomModel.findOne({
      _id: roomId,
      participants: participantId,
    }).exec();

    return room ? true : false;
  }
}