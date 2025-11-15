import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongoose";

@Schema({
  collection: 'rooms'
})
export class RoomSchema {
  _id: ObjectId;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  createdBy: string;

  @Prop({ required: true })
  participants: string[];

  @Prop({ required: true })
  createdAt: Date;
}

export const RoomSchemaClass = SchemaFactory.createForClass(RoomSchema);