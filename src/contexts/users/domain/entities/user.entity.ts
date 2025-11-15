export class User {
  constructor(
    private readonly name: string,
    private readonly createdAt: Date,
    private readonly id?: string,
  ) { }

  static create(
    name: string
  ) {
    return new User(
      name,
      new Date()
    );
  }

  getId(): string | undefined {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  toJson(): Record<string, any> {
    return {
      id: this.id,
      name: this.name,
      createdAt: this.createdAt,
    };
  }
}