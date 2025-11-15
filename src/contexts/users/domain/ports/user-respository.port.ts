import { User } from "@users/domain/entities/user.entity";

export interface UserRepository {
  save(user: User): Promise<User>;
  findByName(name: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}