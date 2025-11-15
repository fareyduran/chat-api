export class AssignParticipantCommand {
  constructor(
    public readonly roomId: string,
    public readonly newParticipantId: string,
  ) { }
}