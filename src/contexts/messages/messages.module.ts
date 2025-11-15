import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from "@users/users.module";
import { MongooseMessageRepository } from "@messages/infrastructure/adapters/outbound/persistence/repositories/message.repository";
import { MessageSchema, MessageSchemaClass } from "@messages/infrastructure/adapters/outbound/persistence/schemas/message.schema";
import { RoomsModule } from "@rooms/rooms.module";
import { MessageController } from "./infrastructure/adapters/inbound/controllers/message.controller";
import { CreateMessageHandler } from "./application/handlers/create-message.handler";
import { GetMessagesByRoomHandler } from "./application/handlers/get-message-by-room.handler";

const CONTROLLERS = [
  MessageController
]

const HANDLERS = [
  GetMessagesByRoomHandler,
  CreateMessageHandler,
]

const REPOSITORIES = {
  MessageRepository: 'MessageRepository'
}

const REPOSITORIES_PROVIDERS = [
  {
    provide: REPOSITORIES.MessageRepository,
    useClass: MongooseMessageRepository
  }
]

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: MessageSchema.name, schema: MessageSchemaClass
    }]),
    UsersModule,
    RoomsModule,
  ],
  controllers: [...CONTROLLERS],
  providers: [...HANDLERS, ...REPOSITORIES_PROVIDERS],
  exports: [REPOSITORIES.MessageRepository],
})
export class MessagesModule { }
