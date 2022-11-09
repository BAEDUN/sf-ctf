import {
  Body,
  Controller,
  forwardRef,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Req,
} from "@nestjs/common";
import { RegisterRequestDto } from "./dto/register.dto";
import { User } from "./schemas/user.schema";
import { UserService } from "./users.service";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { LoginRequestDto, LoginResponseDto } from "./dto/login.dto";
import comparePassword from "./util/comparePassword";
import issueToken from "./util/issueToken";
import { LogService } from "../log/log.service";
import { Request } from "express";
import { StatusRequestDto, StatusResponseDto } from "./dto/status.dto";
import { RankingRequestDto, RankingResponseDto } from "./dto/ranking.dto";
import { ChangePasswordRequestDto } from "./dto/changePassword.dto";
import isServerStarted from "../util/isServerOpen";

@ApiTags("user")
@Controller("user")
export class UsersController {
  constructor(
    private readonly userService: UserService,
    @Inject(forwardRef(() => LogService))
    private readonly logService: LogService
  ) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Successful registration",
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: JSON.stringify(["Duplicated username", "Duplicated email"]),
  })
  @Post("register")
  async register(@Body() body: RegisterRequestDto) {
    const { username, email, password, nickname, section } = body;
    const idDuplicatedUsers = await this.userService.findAll({
      username: body.username,
    });
    if (idDuplicatedUsers.length > 0) {
      throw new HttpException("Duplicated username", HttpStatus.CONFLICT);
    }

    const emailDuplicatedUsers = await this.userService.findAll({
      email: body.email,
    });
    if (emailDuplicatedUsers.length > 0) {
      throw new HttpException("Duplicated email", HttpStatus.CONFLICT);
    }

    await this.userService.create({
      username,
      email,
      password,
      nickname,
      section,
      isAdmin: false,
    });
  }

  @ApiResponse({
    status: 200,
    description: "Successful login",
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Invalid id or password",
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "Didn't start and has no permission",
  })
  @Post("login")
  async login(@Req() request: Request, @Body() body: LoginRequestDto) {
    const user = await this.userService.findOne({
      username: body.username,
    });
    if (!user) {
      throw new HttpException(
        "Invalid id or password",
        HttpStatus.UNAUTHORIZED
      );
    }

    if (!isServerStarted() && !user.isAdmin) {
      throw new HttpException(
        "Didn't start and has no permission",
        HttpStatus.FORBIDDEN
      );
    }

    const passwordMatched = await comparePassword(
      body.password,
      user.hashedPassword
    );
    if (!passwordMatched) {
      throw new HttpException(
        "Invalid id or password",
        HttpStatus.UNAUTHORIZED
      );
    }

    const ip = request.header("x-real-ip") || request.ip;
    await this.logService.logLogin(ip, user.username, user.nickname);

    const accessToken = await issueToken(user);

    return {
      accessToken,
    } as LoginResponseDto;
  }

  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Successful",
    type: StatusResponseDto,
  })
  @Post("status")
  async status(@Body() body: StatusRequestDto) {
    const user = await this.userService.getUserFromToken(body.accessToken);

    if (!user) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    return (await this.userService.status(user.username)) as StatusResponseDto;
  }

  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Successful",
    type: RankingResponseDto,
  })
  @Post("ranking")
  async ranking(@Body() body: RankingRequestDto) {
    const user = await this.userService.getUserFromToken(body.accessToken);

    if (!user) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    const { count, users } = await this.userService.getRanking(
      body.page,
      body.section
    );

    return {
      pages: count,
      users,
    } as RankingResponseDto;
  }

  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Password Changed",
    type: LoginResponseDto,
  })
  @Post("changePassword")
  async changePassword(@Body() body: ChangePasswordRequestDto) {
    const user = await this.userService.getUserFromToken(body.accessToken);

    if (!user) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    const passwordMatched = await comparePassword(
      body.oldPassword,
      user.hashedPassword
    );
    if (!passwordMatched) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    await this.userService.changePassword(user.username, body.newPassword);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll({});
  }
}
