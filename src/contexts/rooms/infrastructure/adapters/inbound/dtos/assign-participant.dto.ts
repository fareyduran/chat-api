import { IsNotEmpty, IsString } from "class-validator";

export class AssignParticipantDto {
  @IsString()
  @IsNotEmpty()
  participantId: string;
}