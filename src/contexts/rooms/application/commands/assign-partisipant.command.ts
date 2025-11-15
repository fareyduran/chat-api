export class AssignPartisipantCommand {
  constructor(
    public readonly roomId: string,
    public readonly newParticipantId: string,
  ) { }
}