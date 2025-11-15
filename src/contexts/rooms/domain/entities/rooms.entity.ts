export class Room {
  constructor(
    private readonly name: string,
    private readonly createdBy: string,
    private participants: string[],
    private readonly createdAt: Date,
    private readonly id?: string,
  ) { }

  static create(
    name: string,
    createdBy: string,
  ) {
    return new Room(
      name,
      createdBy,
      [createdBy],
      new Date()
    );
  }

  getId(): string | undefined {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getCreatedBy(): string {
    return this.createdBy;
  }

  getParticipants(): string[] {
    return this.participants;
  }

  addParticipant(userId: string): void {
    if (!this.participants.includes(userId)) {
      this.participants.push(userId);
    }
  }

  toJson(): Record<string, any> {
    return {
      id: this.id,
      name: this.name,
      createdBy: this.createdBy,
      participants: this.participants,
      createdAt: this.createdAt,
    };
  }
}