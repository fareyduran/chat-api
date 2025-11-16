import { MessageRepository } from "@messages/domain/ports/message-repository.port";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { MessageSchema } from "@messages/infrastructure/adapters/outbound/persistence/schemas/message.schema";
import { Model } from "mongoose";
import { Message } from "@messages/domain/entities/message.entity";
import { MessageMapper } from "@messages/infrastructure/adapters/outbound/persistence/mappers/message.mappers";

@Injectable()
export class MongooseMessageRepository implements MessageRepository {
  constructor(@InjectModel(MessageSchema.name) private messageModel: Model<MessageSchema>) { }

  async save(message: Message): Promise<Message> {
    const createdMessage = await this.messageModel.create(message);

    return MessageMapper.toDomain(createdMessage);
  }

  async findByRoomId(
    roomId: string,
    cursor?: string,
    limit: number = 30
  ): Promise<{ messages: Message[]; hasMore: boolean }> {
    const query: any = { roomId };

    if (cursor) {
      const cursorDate = new Date(cursor);
      query.sentAt = { $lt: cursorDate };
    }

    const messages = await this.messageModel
      .find(query)
      .sort({ sentAt: -1 })
      .limit(limit + 1)
      .exec();

    const hasMore = messages.length > limit;
    const resultMessages = hasMore ? messages.slice(0, limit) : messages;

    return {
      messages: resultMessages.map(MessageMapper.toDomain),
      hasMore,
    };
  }
}