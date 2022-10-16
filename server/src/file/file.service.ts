import { Injectable } from "@nestjs/common";
import { MinioService } from "nestjs-minio-client";

@Injectable()
export class FileService {
  constructor(private readonly minioService: MinioService) {}

  async presignedPutUrl(id: string) {
    const presignedUrl = new URL(
      await this.minioService.client.presignedPutObject("file", id)
    );
    return presignedUrl.href.slice(presignedUrl.origin.length);
  }

  async presignedGetUrl(id: string) {
    const presignedUrl = new URL(
      await this.minioService.client.presignedGetObject("file", id)
    );
    return presignedUrl.href.slice(presignedUrl.origin.length);
  }
}
