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

  async findByRoomId(roomId: string): Promise<Message[]> {
    const messages = await this.messageModel.find({ roomId }).exec();

    return messages.map(MessageMapper.toDomain);
  }
}