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
import { UsersService } from "../user/users.service";
import { GetLogRequestDto, GetLogResponseDto } from "./dto/getLog.dto";
import { LogService } from "./log.service";

@ApiTags("log")
@Controller("log")
export class LogController {
  constructor(
    private readonly logService: LogService,
    @Inject(forwardRef(() => UsersService))
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

    let result = await this.logService.get(body.username, body.ip, body.page);
    return {
      logs: result.logs.map((log) => {
        return {
          id: log._id,
          createdAt: log.createdAt,
          ip: log.ip,
          username: log.username,
          type: log.type,
          filename: log.filename,
          flag: log.flag,
          solved: log.solved,
        };
      }),
      pages: result.pages,
    } as GetLogResponseDto;
  }
}
