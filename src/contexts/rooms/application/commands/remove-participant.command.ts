export class RemoveParticipantCommand {
  constructor(
    public readonly roomId: string,
    public readonly participantId: string,
  ) { }
}