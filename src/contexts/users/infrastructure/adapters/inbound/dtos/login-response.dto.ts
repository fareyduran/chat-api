import { User } from "@users/domain/entities/user.entity";

export class LoginResponseDto {
  message: string;
  data: {
    id: string;
    username: string;
    createdAt: Date;
  };

  static fromDomain(user: User): LoginResponseDto {
    const userJson = user.toJson();
    const dto = new LoginResponseDto();
    dto.message = 'user logged in successfully';
    dto.data = {
      id: userJson.id,
      username: userJson.name,
      createdAt: userJson.createdAt,
    };

    return dto;
  }
}