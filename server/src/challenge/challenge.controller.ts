import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { CreateChallengeRequestDto } from "./dto/createChallenge.dto";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { ChallengeService } from "./challenge.service";
import { UsersService } from "../user/users.service";
import calculateChallengeScore from "./util/calculateChallengeScore";
import {
  GetAllChallengesRequestDto,
  GetAllChallengesResponseDto,
} from "./dto/getAllChallenges.dto";

@ApiTags("challenge")
@Controller("challenge")
export class ChallengeController {
  constructor(
    private readonly challengeService: ChallengeService,
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
    description: "Successful Creation",
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: "Duplicated Title",
  })
  @Post("create")
  async create(@Body() request: CreateChallengeRequestDto) {
    const user = await this.userService.getUserFromToken(request.accessToken);

    if (!user) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    if (!user.isAdmin) {
      throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
    }

    await this.challengeService.create(request).catch((error) => {
      switch (error.code) {
        case 11000:
          throw new HttpException("Duplicated Title", HttpStatus.CONFLICT);
        default:
          throw error;
      }
    });
  }

  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Successful",
    type: GetAllChallengesResponseDto,
  })
  @Post("getAll")
  async getAll(@Body() request: GetAllChallengesRequestDto) {
    const user = await this.userService.getUserFromToken(request.accessToken);

    if (!user) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    let challenges = await this.challengeService.getAll();
    return {
      challenges: challenges.map((challenge) => {
        const { title, description, category, fileList } = challenge;
        const score = calculateChallengeScore(challenge);
        return {
          title,
          description,
          category,
          fileList,
          score,
        };
      }),
    } as GetAllChallengesResponseDto;
  }
}
