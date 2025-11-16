import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Query } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { RoomResponseDto } from "@rooms/infrastructure/adapters/inbound/dtos/room-response.dto";
import { CreateRoomDto } from "@rooms/infrastructure/adapters/inbound/dtos/create-room.dto";
import { CreateRoomCommand } from "@rooms/application/commands/create-room.command";
import { GetRoomsQuery } from "@rooms/application/queries/get-rooms.query";
import { AssignParticipantCommand } from "@rooms/application/commands/assign-participant.command";
import { AssignParticipantDto } from "@rooms/infrastructure/adapters/inbound/dtos/assign-participant.dto";
import { RemoveParticipantCommand } from "@rooms/application/commands/remove-participant.command";
import { PaginatedResponse, PaginationDto } from "@rooms/infrastructure/adapters/inbound/dtos/pagination.dto";

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
  async getRooms(@Query() paginationDto: PaginationDto): Promise<PaginatedResponse<RoomResponseDto>> {
    const { page = 1, limit = 10 } = paginationDto;
    this.logger.log(`Fetching rooms - page: ${page}, limit: ${limit}`);

    const { rooms, total } = await this.queryBus.execute(
      new GetRoomsQuery(page, limit)
    );

    const roomDtos = rooms.map(room => RoomResponseDto.fromDomain(room));
    const totalPages = Math.ceil(total / limit);

    return {
      data: roomDtos,
      metadata: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  @Put(':roomId/participant')
  async assignParticipant(
    @Param('roomId') roomId: string,
    @Body() body: AssignParticipantDto,

  ): Promise<{ message: string }> {
    await this.commandBus.execute(
      new AssignParticipantCommand(roomId, body.participantId)
    );

    return {
      message: 'Participant assigned successfully',
    }
  }

  @Delete(':roomId/participant/:id')
  async removeParticipant(
    @Param('roomId') roomId: string,
    @Param('id') participantId: string,
  ): Promise<{ message: string }> {
    await this.commandBus.execute(
      new RemoveParticipantCommand(roomId, participantId)
    );

    return {
      message: 'Participant removed successfully',
    }
  }
}