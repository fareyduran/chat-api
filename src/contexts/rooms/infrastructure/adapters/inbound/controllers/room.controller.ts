import { Body, Controller, Get, Logger, Post, Put } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { RoomResponseDto } from "@rooms/infrastructure/adapters/inbound/dtos/room-response.dto";
import { CreateRoomDto } from "@rooms/infrastructure/adapters/inbound/dtos/create-room.dto";
import { CreateRoomCommand } from "@rooms/application/commands/create-room.command";
import { GetRoomsQuery } from "@rooms/application/queries/get-rooms.query";
import { AssignPartisipantCommand } from "@rooms/application/commands/assign-partisipant.command";
import { AssignParticipantDto } from "@rooms/infrastructure/adapters/inbound/dtos/assign-participant.dto";

@Controller('/rooms')
export class RoomController {
  private logger = new Logger(RoomController.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) { }

  @Post('')
  async createRoom(@Body() createRoomDto: CreateRoomDto): Promise<RoomResponseDto> {
    this.logger.log(`Creating room with name: ${createRoomDto.name}`);
    const createdRoom = await this.commandBus.execute(
      new CreateRoomCommand(createRoomDto.name, createRoomDto.createdBy)
    );

    return RoomResponseDto.fromDomain(createdRoom);
  }

  @Get('')
  async getRooms(): Promise<{ rooms: RoomResponseDto[] }> {
    this.logger.log(`Fetching all rooms`);
    const rooms = await this.queryBus.execute(new GetRoomsQuery());
    const roomDtos = rooms.map(room => RoomResponseDto.fromDomain(room));

    return { rooms: roomDtos };
  }

  @Put('participant')
  async assignParticipant(
    @Body() body: AssignParticipantDto,
  ): Promise<{ message: string }> {
    await this.commandBus.execute(
      new AssignPartisipantCommand(body.roomId, body.participantId)
    );

    return {
      message: 'Participant assigned successfully',
    }
  }
}