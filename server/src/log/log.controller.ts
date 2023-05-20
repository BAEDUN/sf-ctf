import {
  Body,
  Controller,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Post,
} from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserService } from "../user/users.service";
import { GetLogRequestDto, GetLogResponseDto } from "./dto/getLog.dto";
import {
  GetSolversRequestDto,
  GetSolversResponseDto,
  validateGetSolversRequestDto,
} from "./dto/getSolvers.dto";
import { LogService } from "./log.service";

@ApiTags("log")
@Controller("log")
export class LogController {
  constructor(
    private readonly logService: LogService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
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
    type: GetLogResponseDto,
  })
  @Post("get")
  async get(@Body() body: GetLogRequestDto) {
    const user = await this.userService.getUserFromToken(body.accessToken);

    if (!user) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    if (!user.isAdmin) {
      throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
    }

    let result = await this.logService.get(
      body.username,
      body.nickname,
      body.ip,
      body.page
    );
    return {
      logs: result.logs.map((log) => {
        return {
          id: log._id,
          createdAt: log.createdAt,
          ip: log.ip,
          username: log.username,
          nickname: log.nickname,
          type: log.type,
          filename: log.filename,
          flag: log.flag,
          solved: log.solved,
        };
      }),
      pages: result.pages,
    } as GetLogResponseDto;
  }

  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Bad Request",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Successful",
    type: GetSolversResponseDto,
  })
  @Post("getSolvers")
  async getSolvers(@Body() body: GetSolversRequestDto) {
    if (!validateGetSolversRequestDto(body)) {
      throw new HttpException("Bad Request", HttpStatus.BAD_REQUEST);
    }
    const user = await this.userService.getUserFromToken(body.accessToken);

    if (!user) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    let result = await this.logService.getSolvers(
      body.challengeTitle,
      body.page
    );
    return {
      solvers: result.logs.map((log) => {
        return {
          solvedAt: log.createdAt,
          username: log.username,
        };
      }),
      pages: result.pages,
    } as GetSolversResponseDto;
  }
}
