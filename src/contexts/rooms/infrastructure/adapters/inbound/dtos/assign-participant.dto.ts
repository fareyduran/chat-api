import { IsNotEmpty, IsString } from "class-validator";

export class AssignParticipantDto {
  @IsString()
  @IsNotEmpty()
  roomId: string;

  @IsString()
  @IsNotEmpty()
  participantId: string;
}