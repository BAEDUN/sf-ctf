import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { LoginRequestDto, LoginResponseDto } from "./dto/login.dto";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { UsersService } from "../users/users.service";
import comparePassword from "./util/comparePassword";
import issueToken from "./util/issueToken";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

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
      id: request.id,
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
}
