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
import { UsersService } from "./users.service";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { LoginRequestDto, LoginResponseDto } from "./dto/login.dto";
import comparePassword from "./util/comparePassword";
import issueToken from "./util/issueToken";
import { LogService } from "../log/log.service";
import { Request } from "express";

@ApiTags("user")
@Controller("user")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => LogService))
    private readonly logService: LogService
  ) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Successful registration",
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: JSON.stringify(["Duplicated id", "Duplicated email"]),
  })
  @Post("register")
  async register(@Body() createUserDto: RegisterRequestDto) {
    const idDuplicatedUsers = await this.usersService.findAll({
      username: createUserDto.username,
    });
    if (idDuplicatedUsers.length > 0) {
      throw new HttpException("Duplicated id", HttpStatus.CONFLICT);
    }

    const emailDuplicatedUsers = await this.usersService.findAll({
      email: createUserDto.email,
    });
    if (emailDuplicatedUsers.length > 0) {
      throw new HttpException("Duplicated email", HttpStatus.CONFLICT);
    }

    await this.usersService.create(createUserDto);
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
  @Post("login")
  async login(@Req() request: Request, @Body() body: LoginRequestDto) {
    const user = await this.usersService.findOne({
      username: body.username,
    });
    if (!user) {
      throw new HttpException(
        "Invalid id or password",
        HttpStatus.UNAUTHORIZED
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
    await this.logService.log_login(ip, user.username);

    const accessToken = await issueToken(user);

    return {
      accessToken,
    } as LoginResponseDto;
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll({});
  }
}
