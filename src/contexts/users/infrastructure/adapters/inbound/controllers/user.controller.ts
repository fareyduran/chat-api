import { Body, Controller, Post, Logger } from "@nestjs/common";
import { LoginDto } from "../dtos/login.dto";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { LoginCommand } from "@users/application/commands/login.command";

@Controller('users')
export class UserController {
  private logger = new Logger(UserController.name);

  constructor(
    private readonly commandBus: CommandBus,
  ) { }

  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    this.logger.log(`Login attempt for user: ${loginDto.username}`);
    const loggedUser = await this.commandBus.execute(new LoginCommand(loginDto.username));

    return {
      message: 'user logged in successfully',
      data: loggedUser
    };
  }
}