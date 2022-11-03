import { Connection, Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { CreateChallengeRequestDto } from "./dto/createChallenge.dto";
import { Challenge, ChallengeDocument } from "./schemas/challenge.schema";
import { User, UserDocument } from "../user/schemas/user.schema";
import calculateChallengeScore from "./util/calculateChallengeScore";

@Injectable()
export class ChallengeService {
  constructor(
    @InjectModel(Challenge.name)
    private readonly challengeModel: Model<ChallengeDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectConnection()
    private readonly connection: Connection
  ) {}

  public async create(request: CreateChallengeRequestDto): Promise<Challenge> {
    const createdChallenge = new this.challengeModel(request);
    return createdChallenge.save();
  }

  public async get(title: string) {
    return this.challengeModel.findOne({
      title,
    });
  }

  public async getAll(): Promise<Challenge[]> {
    return this.challengeModel.find().exec();
  }

  public async addSolvedUser(user: User, challenge: ChallengeDocument) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      await challenge.populate("solvedUserList");

      const alreadySolved = challenge.solvedUserList.find(
        (solvedUser) => solvedUser.username === user.username
      );
      if (alreadySolved) {
        throw new Error("Already Solved");
      }

      const previousScore = calculateChallengeScore(challenge);
      challenge.solvedUserList.push(user);
      const nextScore = calculateChallengeScore(challenge);
      const deltaScore = Math.round(nextScore - previousScore);
      await challenge.save();
      if (deltaScore) {
        const alreadySolvedUsernames = challenge.solvedUserList
          .filter((solvedUser) => solvedUser.username !== user.username)
          .map((solvedUser) => solvedUser.username);
        await this.userModel.updateMany(
          {
            username: { $in: alreadySolvedUsernames },
          },
          {
            $inc: {
              score: deltaScore,
            },
          }
        );
      }
      await this.userModel.findOneAndUpdate(
        { username: user.username },
        {
          $inc: {
            score: nextScore,
          },
          $addToSet: {
            solvedChallengeList: challenge,
          },
        }
      );
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }
}
