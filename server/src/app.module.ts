import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { ChallengeModule } from "./challenge/challenge.module";
import { Config } from "./config";
import { FileModule } from "./file/file.module";
import { UsersModule } from "./user/users.module";

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb://${Config.MONGO_ROOT_USERNAME}:${Config.MONGO_ROOT_PASSWORD}@db`
    ),
    UsersModule,
    FileModule,
    ChallengeModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
