import { Message } from "@messages/domain/entities/message.entity";

export interface MessageRepository {
  save(message: Message): Promise<Message>;
  findByRoomId(
    roomId: string,
    cursor?: string,
    limit?: number
  ): Promise<{ messages: Message[]; hasMore: boolean }>;
}