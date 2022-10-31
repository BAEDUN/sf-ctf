import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from "../user/users.module";
import { LogController } from "./log.controller";
import { LogService } from "./log.service";
import { Log, LogSchema } from "./schemas/log.schema";

@Module({
  exports: [LogService],
  imports: [
    MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }]),
    forwardRef(() => UsersModule),
  ],
  controllers: [LogController],
  providers: [LogService],
})
export class LogModule {}
