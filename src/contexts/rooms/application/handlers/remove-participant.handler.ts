import { CommandHandler } from "@nestjs/cqrs";
import { RemoveParticipantCommand } from "../commands/remove-participant.command";
import { Inject, Logger } from "@nestjs/common";
import type { RoomRepository } from "@rooms/domain/ports/room-repository.port";
import type { UserRepository } from "@users/domain/ports/user-respository.port";

@CommandHandler(RemoveParticipantCommand)
export class RemoveParticipantHanlder {
  private readonly logger = new Logger(RemoveParticipantHanlder.name);

  constructor(
    @Inject('RoomRepository')
    private readonly roomRepository: RoomRepository,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) { }

  async execute(command: RemoveParticipantCommand) {
    const { roomId, participantId } = command;
    this.logger.log(`Removing participant: ${participantId} from room: ${roomId}`);

    const participant = await this.userRepository.findById(participantId);
    if (!participant) {
      this.logger.warn(`Participant to remove ${participantId} not found.`);
      throw new Error(`Participant to remove ${participantId} not found.`);
    }

    const room = await this.roomRepository.findById(roomId);
    if (!room) {
      this.logger.warn(`Room ${roomId} not found.`);
      throw new Error(`Room ${roomId} not found.`);
    }

    const isParticipant = await this.roomRepository.findParticipantInRoom(roomId, participantId);
    if (!isParticipant) {
      this.logger.warn(`Participant ${participantId} is not in room ${roomId}.`);
      throw new Error(`Participant ${participantId} is not in room ${roomId}.`);
    }

    const updatedParticipants = room.getParticipants().filter(id => id !== participantId);

    try {
      return await this.roomRepository.updateParticipants(roomId, updatedParticipants);
    } catch (error) {
      this.logger.error(`Error removing participant from room ${roomId}: ${error.message}`);
      throw new Error('Could not remove participant from room...');
    }
  }
}