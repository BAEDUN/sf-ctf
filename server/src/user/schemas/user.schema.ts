import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, index: true, unique: true })
  username!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  hashedPassword!: string;

  @Prop({ required: true })
  nickname!: string;

  @Prop({ required: true, type: Boolean })
  isAdmin!: boolean;

  @Prop({ required: true, type: Boolean })
  isBanned!: boolean;

  @Prop({ required: true, enum: ["Security", "Software", "SecurityFirst"] })
  section!: Section;
}

export enum Section {
  Security = "Security",
  Software = "Software",
  SecurityFirst = "SecurityFirst",
}

export const CatSchema = SchemaFactory.createForClass(User);
