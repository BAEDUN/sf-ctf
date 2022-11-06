import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { LogModule } from "../log/log.module";
import { UserSchema, User } from "./schemas/user.schema";
import { UsersController } from "./users.controller";
import { UserService } from "./users.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => LogModule),
  ],
  exports: [UserService],
  controllers: [UsersController],
  providers: [UserService],
})
export class UsersModule {}
