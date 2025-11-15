export class Message {
  constructor(
    private readonly roomId: string,
    private readonly senderId: string,
    private readonly senderName: string,
    private readonly message: string,
    private readonly sentAt: Date,
    private readonly id?: string,
  ) { }

  static create(
    roomId: string,
    senderId: string,
    senderName: string,
    message: string,
  ) {
    return new Message(
      roomId,
      senderId,
      senderName,
      message,
      new Date()
    );
  }

  getId(): string | undefined {
    return this.id;
  }

  getRoomId(): string {
    return this.roomId;
  }

  getSenderId(): string {
    return this.senderId;
  }

  getSenderName(): string {
    return this.senderName;
  }

  getMessage(): string {
    return this.message;
  }

  getSentAt(): Date {
    return this.sentAt;
  }

  toJson(): Record<string, any> {
    return {
      id: this.id,
      roomId: this.roomId,
      senderId: this.senderId,
      senderName: this.senderName,
      message: this.message,
      sentAt: this.sentAt,
    };
  }
}