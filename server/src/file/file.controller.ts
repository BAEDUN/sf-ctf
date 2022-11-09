import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
} from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { FileService } from "./file.service";
import { PutRequestDto, PutResponseDto } from "./dto/put.dto";
import { v4 as uuid } from "uuid";
import { UserService } from "../user/users.service";
import { GetRequestDto, GetResponseDto } from "./dto/get.dto";
import { LogService } from "../log/log.service";
import { Request } from "express";

@ApiTags("file")
@Controller("file")
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly userService: UserService,
    private readonly logService: LogService
  ) {}

  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized",
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "Forbidden",
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: "File Already Exist",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Successful",
    type: PutResponseDto,
  })
  @Post("put")
  async put(@Body() body: PutRequestDto) {
    const user = await this.userService.getUserFromToken(body.accessToken);

    if (!user) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    if (!user.isAdmin) {
      throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
    }

    const presignedUrl = await this.fileService
      .presignedPutUrl(body.filename)
      .catch((error) => {
        switch (error.message) {
          case "FileAlreadyExist": {
            throw new HttpException("File Already Exist", HttpStatus.CONFLICT);
          }
          default: {
            throw error;
          }
        }
      });
    return {
      presignedUrl,
    } as PutResponseDto;
  }

  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Bad Request",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Successful",
    type: GetResponseDto,
  })
  @Post("get")
  async get(@Req() request: Request, @Body() body: GetRequestDto) {
    const user = await this.userService.getUserFromToken(body.accessToken);

    if (!user) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    if (!body.filename) {
      throw new HttpException("Bad Request", HttpStatus.BAD_REQUEST);
    }

    const presignedUrl = await this.fileService.presignedGetUrl(body.filename);

    const ip = request.header("x-real-ip") || request.ip;
    this.logService.logDownload(
      ip,
      user.username,
      user.nickname,
      body.filename
    );
    return {
      presignedUrl,
    } as GetResponseDto;
  }
}
