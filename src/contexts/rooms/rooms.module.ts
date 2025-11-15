import { Module } from "@nestjs/common";
import { RoomController } from "@rooms/infrastructure/adapters/inbound/controllers/room.controller";
import { CreateRoomHandler } from "@rooms/application/handlers/create-room.handler";
import { MongooseRoomRepository } from "./infrastructure/adapters/outbound/persistence/repositories/room.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { RoomSchema, RoomSchemaClass } from "@rooms/infrastructure/adapters/outbound/persistence/schemas/room.schema";
import { UsersModule } from "@users/users.module";
import { GetRoomsHandler } from "@rooms/application/handlers/get-rooms.handler";
import { AssignParticipantHandler } from "@rooms/application/handlers/assign-participant.handler";
import { RemoveParticipantHanlder } from "./application/handlers/remove-participant.handler";

const CONTROLLERS = [RoomController]

const HANDLERS = [
  CreateRoomHandler,
  GetRoomsHandler,
  AssignParticipantHandler,
  RemoveParticipantHanlder,
]

const REPOSITORIES = {
  RoomRepository: 'RoomRepository'
}

const REPOSITORIES_PROVIDERS = [
  {
    provide: REPOSITORIES.RoomRepository,
    useClass: MongooseRoomRepository
  }
]

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: RoomSchema.name, schema: RoomSchemaClass
    }]),
    UsersModule,
  ],
  controllers: [...CONTROLLERS],
  providers: [...HANDLERS, ...REPOSITORIES_PROVIDERS],
  exports: [REPOSITORIES.RoomRepository],
})
export class RoomsModule { }
