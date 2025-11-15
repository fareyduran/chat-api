import { BadRequestException, Inject, Logger } from "@nestjs/common";
import { CommandHandler } from "@nestjs/cqrs";
import { Room } from "@rooms/domain/entities/rooms.entity";
import type { RoomRepository } from "@rooms/domain/ports/room-repository.port";
import type { UserRepository } from "@users/domain/ports/user-respository.port";
import { AssignPartisipantCommand } from "@rooms/application/commands/assign-partisipant.command";

@CommandHandler(AssignPartisipantCommand)
export class AssignPartisipantHandler {
  private readonly logger = new Logger(AssignPartisipantHandler.name);
  constructor(
    @Inject('RoomRepository')
    private readonly roomRepository: RoomRepository,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) { }

  async execute(command: AssignPartisipantCommand): Promise<Room> {
    const { roomId, newParticipantId } = command;
    this.logger.log(`Assigning participant: ${newParticipantId} to room: ${roomId}`);

    const newParticipant = await this.userRepository.findById(newParticipantId);
    if (!newParticipant) {
      this.logger.warn(`Participant to assign ${newParticipant} not found.`);
      throw new BadRequestException(`Participant to assign ${newParticipant} not found.`);
    }
    const room = await this.roomRepository.findById(roomId);

    if (!room) {
      this.logger.warn(`Room ${roomId} not found.`);
      throw new BadRequestException(`Room ${roomId} not found.`);
    }

    const isAlreadyParticipant = await this.roomRepository.findParticipantInRoom(roomId, newParticipantId);

    if (isAlreadyParticipant) {
      this.logger.warn(`Participant ${newParticipantId} is already in room ${roomId}.`);
      throw new BadRequestException(`Participant ${newParticipantId} is already in room ${roomId}.`);
    }

    try {
      return await this.roomRepository.updateParticipants(roomId, [...room.getParticipants(), newParticipantId]);
    } catch (error) {
      this.logger.error(`Error assigning new participant to room ${roomId}: ${error.message}`);
      throw new BadRequestException('Could not assign participant to room...');
    }
  }
}