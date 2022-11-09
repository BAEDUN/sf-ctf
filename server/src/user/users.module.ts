import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  Challenge,
  ChallengeSchema,
} from "../challenge/schemas/challenge.schema";
import { LogModule } from "../log/log.module";
import { Log, LogSchema } from "../log/schemas/log.schema";
import { UserSchema, User } from "./schemas/user.schema";
import { UsersController } from "./users.controller";
import { UserService } from "./users.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Challenge.name, schema: ChallengeSchema },
      { name: Log.name, schema: LogSchema },
    ]),
    forwardRef(() => LogModule),
  ],
  exports: [UserService],
  controllers: [UsersController],
  providers: [UserService],
})
export class UsersModule {}
