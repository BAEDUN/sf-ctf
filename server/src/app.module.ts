import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { Config } from "./config";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb://${Config.MONGO_ROOT_USERNAME}:${Config.MONGO_ROOT_PASSWORD}@db`
    ),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
