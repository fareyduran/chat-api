import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { LoginCommand } from "../commands/login.command";
import { BadRequestException, Inject, Logger } from "@nestjs/common";
import type { UserRepository } from "@users/domain/ports/user-respository.port";
import { User } from "@users/domain/entities/user.entity";

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  private readonly logger = new Logger(LoginHandler.name);
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository
  ) { }

  async execute(command: LoginCommand) {
    try {
      const foundUser = await this.userRepository.findByName(command.username);
      if (foundUser) {
        this.logger.log(`User ${command.username} is already created, logging in.`);
        return foundUser;
      }

      this.logger.log(`User ${command.username} is not found, creating new user.`);
      const userToCreate = User.create(command.username);
      return await this.userRepository.save(userToCreate)
    } catch (error) {
      this.logger.error(`Error logging in user ${command.username}: ${error.message}`);
      throw new BadRequestException('Could not log in user...');
    }
  }
}