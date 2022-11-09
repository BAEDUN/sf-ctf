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
import isServerEnded from "../util/isServerEnded";

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

    await this.challengeService
      .create(request, user.username)
      .catch((error) => {
        switch (error.code) {
          case 11000:
            throw new HttpException("Duplicated Title", HttpStatus.CONFLICT);
          default:
            throw error;
        }
      });
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
    type: GetAllChallengesResponseDto,
  })
  @Post("getAll")
  async getAll(@Body() request: GetAllChallengesRequestDto) {
    if (!request.validate()) {
      throw new HttpException("Bad Request", HttpStatus.BAD_REQUEST);
    }
    const user = await this.userService.getUserFromToken(request.accessToken);

    if (!user) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    let challenges = await this.challengeService.getAll();
    return {
      challenges: challenges.map((challenge) => {
        const {
          title,
          description,
          category,
          fileList,
          solvedUserList,
          authorUsername,
        } = challenge;
        const score = calculateChallengeScore(challenge);
        const solved = solvedUserList.some(
          (solvedUser) => solvedUser.username === user.username
        );
        return {
          title,
          description,
          category,
          fileList,
          score,
          solved,
          solverCount: solvedUserList.length,
          authorUsername,
        };
      }),
    } as GetAllChallengesResponseDto;
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
    status: HttpStatus.FORBIDDEN,
    description: "Ended and has no permission",
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
    if (!body.validate()) {
      throw new HttpException("Bad Request", HttpStatus.BAD_REQUEST);
    }
    const user = await this.userService.getUserFromToken(body.accessToken);

    if (!user) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    if (isServerEnded() && !user.isAdmin) {
      throw new HttpException(
        "Ended and has no permission",
        HttpStatus.FORBIDDEN
      );
    }

    const challenge = await this.challengeService.get(body.title);
    if (!challenge) {
      throw new HttpException("Challenge Not Found", HttpStatus.NOT_FOUND);
    }

    const ip = request.header("x-real-ip") || request.ip;
    const flagMatched = challenge.flag === body.flag;
    if (!flagMatched) {
      await this.logService.logSubmitFlag(
        ip,
        user.username,
        user.nickname,
        body.flag,
        false,
        challenge.title
      );
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

    await this.logService.logSubmitFlag(
      ip,
      user.username,
      user.nickname,
      body.flag,
      true,
      challenge.title
    );

    return {
      success: true,
    } as SubmitResponseDto;
  }
}
