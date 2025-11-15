import { Body, Controller, Post, Logger } from "@nestjs/common";
import { LoginDto } from "../dtos/login.dto";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { LoginCommand } from "@users/application/commands/login.command";
import { LoginResponseDto } from "../dtos/login-response.dto";

@Controller('users')
export class UserController {
  private logger = new Logger(UserController.name);

  constructor(
    private readonly commandBus: CommandBus,
  ) { }

  @Post('/login')
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    this.logger.log(`Login attempt for user: ${loginDto.username}`);
    const loggedUser = await this.commandBus.execute(new LoginCommand(loginDto.username));

    return LoginResponseDto.fromDomain(loggedUser);
  }
}