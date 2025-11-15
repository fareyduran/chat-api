import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema, UserSchemaClass } from "@users/infrastructure/adapters/outbound/persistence/schemas/user.schema";
import { UserController } from "@users/infrastructure/adapters/inbound/controllers/user.controller";
import { LoginHandler } from "@users/application/handlers/login.handler";
import { MongooseUserRepository } from "./infrastructure/adapters/outbound/persistence/repositories/user.repository";

const CONTROLLERS = [UserController]

const HANDLERS = [
  LoginHandler,
]

const REPOSITORIES = {
  UserRepository: 'UserRepository'
}

const REPOSITORIES_PROVIDERS = [
  {
    provide: REPOSITORIES.UserRepository,
    useClass: MongooseUserRepository
  }
]

@Module({
  imports: [MongooseModule.forFeature([{
    name: UserSchema.name, schema: UserSchemaClass
  }])],
  controllers: [...CONTROLLERS],
  providers: [...HANDLERS, ...REPOSITORIES_PROVIDERS],
  exports: [REPOSITORIES.UserRepository],
})
export class UsersModule { }
