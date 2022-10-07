import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, index: true, unique: true })
  id!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  hashedPassword!: string;

  @Prop({ required: true })
  nickname!: string;

  @Prop()
  studentIdNumber!: string;

  @Prop({ required: true })
  realName!: string;

  @Prop({ required: true, type: Boolean })
  isAdmin!: boolean;

  @Prop({ required: true, type: Boolean })
  isBanned!: boolean;

  @Prop({ required: true, enum: ["OB", "YB"] })
  section!: string;
}

export const CatSchema = SchemaFactory.createForClass(User);
