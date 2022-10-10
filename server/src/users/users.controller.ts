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

@ApiTags("users")
@Controller("users")
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
      id: createUserDto.id,
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

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll({});
  }
}
