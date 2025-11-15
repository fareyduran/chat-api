import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongoose";

@Schema({
  collection: 'users',
})
export class UserSchema {
  _id: ObjectId;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  createdAt: Date;
}

export const UserSchemaClass = SchemaFactory.createForClass(UserSchema);