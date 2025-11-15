import { Message } from "@messages/domain/entities/message.entity";

export class MessageResponseDto {
  id: string;
  roomId: string
  senderId: string;
  senderName: string
  message: string;
  sentAt: Date;

  static fromDomain(message: Message): MessageResponseDto {
    const dto = new MessageResponseDto();
    const messageJson = message.toJson();
    dto.id = messageJson.id;
    dto.roomId = messageJson.roomId;
    dto.senderId = messageJson.senderId;
    dto.senderName = messageJson.senderName;
    dto.message = messageJson.message;
    dto.sentAt = messageJson.sentAt;
    return dto;
  }
}