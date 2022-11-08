import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type LogDocument = Log & Document;

export enum LogType {
  Login = "Login",
  Download = "Download",
  Submit = "Submit",
}

@Schema()
export class Log {
  @Prop({ index: true, default: Date.now() })
  createdAt!: Date;

  @Prop({ required: true, index: true })
  ip!: string;

  @Prop({ required: true, index: true })
  username!: string;

  @Prop({ required: true })
  nickname!: string;

  @Prop({
    required: true,
    enum: [LogType.Login, LogType.Download, LogType.Submit],
  })
  type!: LogType;

  @Prop({ default: "" })
  filename!: string;

  @Prop({ default: "" })
  flag!: string;

  @Prop({ default: false })
  solved!: boolean;

  @Prop({ default: "" })
  challengeTitle!: string;
}

export const LogSchema = SchemaFactory.createForClass(Log);
