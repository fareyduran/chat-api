export class GetMessagesByRoomQuery {
  constructor(
    public readonly roomId: string,
    public readonly cursor?: string,
    public readonly limit: number = 30,
  ) { }
}