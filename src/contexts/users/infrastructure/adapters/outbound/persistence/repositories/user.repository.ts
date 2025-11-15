import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UserSchema } from "@users/infrastructure/adapters/outbound/persistence/schemas/user.schema";
import { Model } from "mongoose";
import { UserRepository } from "@users/domain/ports/user-respository.port";
import { User } from "@users/domain/entities/user.entity";
import { UserMapper } from "@users/infrastructure/adapters/outbound/persistence/mappers/user.mapper";

@Injectable()
export class MongooseUserRepository implements UserRepository {
  constructor(@InjectModel(UserSchema.name) private userModel: Model<UserSchema>) { }

  async save(user: User): Promise<User> {
    const createdUser = await this.userModel.create(user);

    return UserMapper.toDomain(createdUser);
  }

  async findByName(name: string): Promise<User | null> {
    const userSchema = await this.userModel.findOne({ name }).exec();
    if (!userSchema) {
      return null;
    }
    return UserMapper.toDomain(userSchema);
  }
}