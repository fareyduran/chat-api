import { User } from "@users/domain/entities/user.entity";
import { UserSchema } from "../schemas/user.schema";

export class UserMapper {
  static toDomain(userSchema: UserSchema): User {
    return new User(
      userSchema.name,
      userSchema.createdAt,
      userSchema._id.toString()
    );
  }
}