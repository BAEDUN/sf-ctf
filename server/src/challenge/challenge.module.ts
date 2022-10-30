import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from "../user/users.module";
import { ChallengeController } from "./challenge.controller";
import { ChallengeService } from "./challenge.service";
import { Challenge, ChallengeSchema } from "./schemas/challenge.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Challenge.name, schema: ChallengeSchema },
    ]),
    UsersModule,
  ],
  controllers: [ChallengeController],
  providers: [ChallengeService],
})
export class ChallengeModule {}
