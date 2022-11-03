import { Injectable } from "@nestjs/common";
import { MinioService } from "nestjs-minio-client";

@Injectable()
export class FileService {
  constructor(private readonly minioService: MinioService) {}

  async presignedPutUrl(filename: string) {
    const alreadyExistingFileStat = await this.minioService.client
      .statObject("file", filename)
      .catch((error) => {
        switch (error.code) {
          case "NotFound": {
            return null;
          }
          default: {
            throw error;
          }
        }
      });
    if (alreadyExistingFileStat) {
      throw new Error("FileAlreadyExist");
    }
    const presignedUrl = new URL(
      await this.minioService.client.presignedPutObject("file", filename)
    );
    return presignedUrl.href.slice(presignedUrl.origin.length);
  }

  async presignedGetUrl(filename: string) {
    const presignedUrl = new URL(
      await this.minioService.client.presignedGetObject("file", filename)
    );
    return presignedUrl.href.slice(presignedUrl.origin.length);
  }
}
