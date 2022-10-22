import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { User } from "../../user/schemas/user.schema";

export type ChallengeDocument = Challenge & Document;

@Schema()
export class Challenge {
  @Prop({ required: true, index: true, unique: true })
  title!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ default: [] })
  fileList!: {
    fileName: string;
    fileId: string;
  }[];

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
