import { BadRequestException, Inject, Logger } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateRoomCommand } from "@rooms/application/commands/create-room.command";
import { Room } from "@rooms/domain/entities/rooms.entity";
import type { RoomRepository } from "@rooms/domain/ports/room-repository.port";
import type { UserRepository } from "@users/domain/ports/user-respository.port";

@CommandHandler(CreateRoomCommand)
export class CreateRoomHandler implements ICommandHandler<CreateRoomCommand> {
  private readonly logger = new Logger(CreateRoomHandler.name);
  constructor(
    @Inject('RoomRepository')
    private readonly roomRepository: RoomRepository,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) { }

  async execute(command: CreateRoomCommand): Promise<Room> {
    const { name, createdBy } = command;
    this.logger.log(`Creating room: ${name}, created by: ${createdBy}`);

    const author = await this.userRepository.findById(createdBy);
    if (!author) {
      this.logger.warn(`User ${createdBy} not found.`);
      throw new BadRequestException(`User ${createdBy} not found.`);
    }

    const roomToCreate = Room.create(name, createdBy)

    try {
      return await this.roomRepository.save(roomToCreate);
    } catch (error) {
      this.logger.error(`Error creating room ${name}: ${error.message}`);
      throw new BadRequestException('Could not create room...');
    }
  }
}