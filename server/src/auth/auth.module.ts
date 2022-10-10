import { forwardRef, Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [forwardRef(() => UsersModule)],
  controllers: [AuthController],
})
export class AuthModule {}
