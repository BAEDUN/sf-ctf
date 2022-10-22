import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { RegisterRequestDto } from "./dto/register.dto";
import { User } from "./schemas/user.schema";
import { UsersService } from "./users.service";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { LoginRequestDto, LoginResponseDto } from "./dto/login.dto";
import comparePassword from "./util/comparePassword";
import issueToken from "./util/issueToken";

@ApiTags("user")
@Controller("user")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
    console.log("User 1");
    const idDuplicatedUsers = await this.usersService.findAll({
      username: createUserDto.username,
    });
    if (idDuplicatedUsers.length > 0) {
      throw new HttpException("Duplicated id", HttpStatus.CONFLICT);
    }

    console.log("User 2");
    const emailDuplicatedUsers = await this.usersService.findAll({
      email: createUserDto.email,
    });
    if (emailDuplicatedUsers.length > 0) {
      throw new HttpException("Duplicated email", HttpStatus.CONFLICT);
    }

    await this.usersService.create(createUserDto);
    console.log("User created");
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
  async login(@Body() request: LoginRequestDto) {
    const user = await this.usersService.findOne({
      username: request.username,
    });
    if (!user) {
      throw new HttpException(
        "Invalid id or password",
        HttpStatus.UNAUTHORIZED
      );
    }

    const passwordMatched = await comparePassword(
      request.password,
      user.hashedPassword
    );
    if (!passwordMatched) {
      throw new HttpException(
        "Invalid id or password",
        HttpStatus.UNAUTHORIZED
      );
    }

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
