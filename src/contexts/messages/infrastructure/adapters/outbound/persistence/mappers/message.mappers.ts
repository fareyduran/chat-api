import { Message } from "@messages/domain/entities/message.entity";
import { MessageSchema } from "../schemas/message.schema";

export class MessageMapper {
  static toDomain(messageSchema: MessageSchema): Message {
    return new Message(
      messageSchema.roomId,
      messageSchema.senderId,
      messageSchema.senderName,
      messageSchema.message,
      messageSchema.sentAt,
      messageSchema._id.toString()
    );
  }
}