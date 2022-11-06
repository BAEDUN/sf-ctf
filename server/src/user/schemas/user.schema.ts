import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Challenge } from "../../challenge/schemas/challenge.schema";

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

  @Prop({ required: true, type: Boolean, default: false })
  isBanned!: boolean;

  @Prop({ required: true, enum: ["Security", "Software", "SecurityFirst"] })
  section!: Section;

  @Prop({
    type: [{ type: mongoose.Types.ObjectId, ref: "Challenge" }],
    default: [],
  })
  solvedChallengeList!: Challenge[];

  @Prop({ default: 0 })
  score!: number;
}

export enum Section {
  Security = "Security",
  Software = "Software",
  SecurityFirst = "SecurityFirst",
}

export const UserSchema = SchemaFactory.createForClass(User);
