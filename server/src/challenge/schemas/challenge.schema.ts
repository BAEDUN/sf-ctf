import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { User } from "../../user/schemas/user.schema";

export type ChallengeDocument = Challenge & Document;

export enum Category {
  Web = "Web",
  Forensic = "Forensic",
  Pwnable = "Pwnable",
  Reversing = "Reversing",
  Misc = "Misc",
}

@Schema()
export class Challenge {
  @Prop({ required: true, index: true, unique: true })
  title!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({
    required: true,
    enum: [
      Category.Web,
      Category.Forensic,
      Category.Pwnable,
      Category.Reversing,
      Category.Misc,
    ],
  })
  category!: Category;

  @Prop({ default: [] })
  fileList!: String[];

  @Prop({
    type: {
      minimumScore: Number,
      maximumScore: Number,
      maximumSolvedUserCount: Number,
    },
    required: true,
  })
  grading!: {
    minimumScore: number;
    maximumScore: number;
    maximumSolvedUserCount: number;
  };

  @Prop({ required: true })
  flag!: string;

  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: "User" }], default: [] })
  solvedUserList!: User[];
}

export const ChallengeSchema = SchemaFactory.createForClass(Challenge);
