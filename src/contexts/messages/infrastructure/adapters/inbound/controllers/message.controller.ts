import { Body, Controller, Get, Logger, Param, Post } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateMessageDto } from "@messages/infrastructure/adapters/inbound/dto/create-message.dto";
import { MessageResponseDto } from "@messages/infrastructure/adapters/inbound/dto/message-response.dto";
import { CreateMessageCommand } from "@messages/application/commands/create-message.command";
import { GetMessagesByRoomQuery } from "@messages/application/queries/get-message-by-room.query";

@Controller('/messages')
export class MessageController {
  private logger = new Logger(MessageController.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) { }

  @Post('')
  async createMessage(@Body() createMessageDto: CreateMessageDto): Promise<MessageResponseDto> {
    this.logger.log(`Creating message from sender: ${createMessageDto.senderId}`);
    const createdMessage = await this.commandBus.execute(
      new CreateMessageCommand(createMessageDto.roomId, createMessageDto.senderId, createMessageDto.message)
    );

    return MessageResponseDto.fromDomain(createdMessage);
  }

  @Get('rooms/:roomId')
  async getMessagesByRoom(@Param('roomId') roomId: string): Promise<{ messages: MessageResponseDto[] }> {
    this.logger.log(`Fetching messages for room: ${roomId}`);
    const messages = await this.queryBus.execute(new GetMessagesByRoomQuery(roomId));
    const messageDtos = messages.map(message => MessageResponseDto.fromDomain(message));

    return { messages: messageDtos };
  }
}