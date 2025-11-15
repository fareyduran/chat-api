export class CreateRoomCommand {
  constructor(
    public readonly name: string,
    public readonly createdBy: string,
  ) { }
}