import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateMessageCommand } from "@messages/application/commands/create-message.command";
import { BadRequestException, Inject, Logger, UnauthorizedException } from "@nestjs/common";
import type { RoomRepository } from "@rooms/domain/ports/room-repository.port";
import type { UserRepository } from "@users/domain/ports/user-respository.port";
import type { MessageRepository } from "@messages/domain/ports/message-repository.port";
import { Message } from "@messages/domain/entities/message.entity";

@CommandHandler(CreateMessageCommand)
export class CreateMessageHandler implements ICommandHandler<CreateMessageCommand> {
  private readonly logger = new Logger(CreateMessageHandler.name);

  constructor(
    @Inject('RoomRepository')
    private readonly roomRepository: RoomRepository,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('MessageRepository')
    private readonly messageRepository: MessageRepository,
  ) { }

  async execute(command: CreateMessageCommand) {
    const { roomId, senderId, message } = command;
    this.logger.log(`Creating message in room: ${roomId}, by user: ${senderId}`);

    const author = await this.userRepository.findById(senderId);
    if (!author) {
      this.logger.warn(`User ${senderId} not found.`);
      throw new BadRequestException(`User ${senderId} not found.`);
    }

    const room = await this.roomRepository.findById(roomId);
    if (!room) {
      this.logger.warn(`Room ${roomId} not found.`);
      throw new BadRequestException(`Room ${roomId} not found.`);
    }

    const isMember = await this.roomRepository.findParticipantInRoom(roomId, senderId);
    if (!isMember) {
      this.logger.warn(`User ${senderId} is not a participant of room ${roomId}.`);
      throw new UnauthorizedException(`User ${senderId} is not a participant of room ${roomId}.`);
    }

    const messageToCreate = Message.create(roomId, senderId, author.getName(), message);

    try {
      return await this.messageRepository.save(messageToCreate);
    } catch (error) {
      this.logger.error(`Error creating message in room ${roomId}: ${error.message}`);
      throw new BadRequestException('Could not create message...');
    }
  }
}