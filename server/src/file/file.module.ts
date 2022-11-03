import { Module } from "@nestjs/common";
import { MinioModule } from "nestjs-minio-client";
import { Config } from "../config";
import { LogModule } from "../log/log.module";
import { UsersModule } from "../user/users.module";
import { FileController } from "./file.controller";
import { FileService } from "./file.service";

@Module({
  imports: [
    MinioModule.register({
      endPoint: "storage",
      port: 9000,
      useSSL: false,
      accessKey: Config.MINIO_ROOT_USER,
      secretKey: Config.MINIO_ROOT_PASSWORD,
    }),
    UsersModule,
    LogModule,
  ],
  exports: [FileService],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
