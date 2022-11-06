import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
} from "@nestjs/common";
import { CreateChallengeRequestDto } from "./dto/createChallenge.dto";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { ChallengeService } from "./challenge.service";
import { UserService } from "../user/users.service";
import calculateChallengeScore from "./util/calculateChallengeScore";
import {
  GetAllChallengesRequestDto,
  GetAllChallengesResponseDto,
} from "./dto/getAllChallenges.dto";
import { SubmitRequestDto, SubmitResponseDto } from "./dto/submitFlag.dto";
import { LogService } from "../log/log.service";
import { Request } from "express";

@ApiTags("challenge")
@Controller("challenge")
export class ChallengeController {
  constructor(
    private readonly challengeService: ChallengeService,
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

  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Challenge Not Found",
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: "Already Solved",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Successful",
    type: SubmitResponseDto,
  })
  @Post("submitFlag")
  async submitFlag(@Req() request: Request, @Body() body: SubmitRequestDto) {
    const user = await this.userService.getUserFromToken(body.accessToken);

    if (!user) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    const challenge = await this.challengeService.get(body.title);
    if (!challenge) {
      throw new HttpException("Challenge Not Found", HttpStatus.NOT_FOUND);
    }

    const ip = request.header("x-real-ip") || request.ip;
    const flagMatched = challenge.flag === body.flag;
    if (!flagMatched) {
      await this.logService.logSubmitFlag(ip, user.username, body.flag, false);
      return {
        success: false,
      } as SubmitResponseDto;
    }

    await this.challengeService
      .addSolvedUser(user, challenge)
      .catch((error) => {
        switch (error.message) {
          case "Already Solved": {
            throw new HttpException("Already Solved", HttpStatus.CONFLICT);
          }
          default: {
            throw error;
          }
        }
      });

    await this.logService.logSubmitFlag(ip, user.username, body.flag, true);

    return {
      success: true,
    } as SubmitResponseDto;
  }
}
