import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { FileService } from "./file.service";
import { PutRequestDto, PutResponseDto } from "./dto/put.dto";
import { v4 as uuid } from "uuid";
import { UsersService } from "../user/users.service";
import { GetRequestDto, GetResponseDto } from "./dto/get.dto";

@ApiTags("file")
@Controller("file")
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly userService: UsersService
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
    status: HttpStatus.CREATED,
    description: "Successful",
    type: PutResponseDto,
  })
  @Post("put")
  async put(@Body() putRequestDto: PutRequestDto) {
    const user = await this.userService.getUserFromToken(
      putRequestDto.accessToken
    );

    if (!user) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    if (!user.isAdmin) {
      throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
    }

    const fileId = uuid();
    const presignedUrl = await this.fileService.presignedPutUrl(fileId);
    return {
      fileId,
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
  async get(@Body() getRequestDto: GetRequestDto) {
    const user = await this.userService.getUserFromToken(
      getRequestDto.accessToken
    );

    if (!user) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    if (!getRequestDto.fileId) {
      throw new HttpException("Bad Request", HttpStatus.BAD_REQUEST);
    }

    const presignedUrl = await this.fileService.presignedGetUrl(
      getRequestDto.fileId
    );
    return {
      presignedUrl,
    } as GetResponseDto;
  }
}
