import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { ObjectId } from "mongoose";

@Schema({
  collection: 'messages'
})
export class MessageSchema {
  _id: ObjectId;

  @Prop({ required: true })
  roomId: string;

  @Prop({ required: true })
  senderId: string;

  @Prop({ required: true })
  senderName: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  sentAt: Date;
}

export const MessageSchemaClass = SchemaFactory.createForClass(MessageSchema);