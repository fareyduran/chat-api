export class CreateMessageCommand {
  constructor(
    public readonly roomId: string,
    public readonly senderId: string,
    public readonly message: string,
  ) { }
}