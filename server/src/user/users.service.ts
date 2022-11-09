import { FilterQuery, Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Section, User, UserDocument } from "./schemas/user.schema";
import hashPassword from "./util/hashPassword";
import validateToken from "./util/validateToken";
import { Log, LogDocument, LogType } from "../log/schemas/log.schema";
import {
  Challenge,
  ChallengeDocument,
} from "../challenge/schemas/challenge.schema";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Log.name) private readonly logModel: Model<LogDocument>,
    @InjectModel(Challenge.name)
    private readonly challengeModel: Model<ChallengeDocument>
  ) {}

  public async create(
    rawUser: Omit<
      User,
      "hashedPassword" | "isBanned" | "solvedChallengeList" | "score"
    > & { password: string }
  ): Promise<User> {
    const { username, email, password, nickname, isAdmin, section } = rawUser;
    const hashedPassword = await hashPassword(password);
    const createdCat = new this.userModel({
      username,
      email,
      hashedPassword,
      nickname,
      isAdmin,
      section,
    });
    return createdCat.save();
  }

  async findAll(query: FilterQuery<UserDocument>): Promise<User[]> {
    return this.userModel.find(query).exec();
  }

  async findOne(query: FilterQuery<UserDocument>): Promise<User | null> {
    return this.userModel.findOne(query);
  }

  async status(username: string) {
    const user = await this.userModel.findOne({
      username,
    });
    if (!user) {
      throw new Error("User not found");
    }
    const { nickname, score } = user;
    const solvedLogs = await this.logModel
      .find({
        username,
        type: LogType.Submit,
        solved: true,
      })
      .exec();
    const solvedChallenges = await Promise.all(
      solvedLogs.map((log) =>
        this.challengeModel
          .findOne({
            title: log.challengeTitle,
          })
          .then((challenge) => {
            return {
              title: log.challengeTitle,
              category: challenge!.category,
              solvedAt: log.createdAt.toString(),
            };
          })
      )
    );
    return {
      username,
      nickname,
      score,
      solvedChallenges,
    };
  }

  async getRanking(page: number, section?: Section) {
    const docPerPage = 15;
    const refinedPage = Math.max(page * docPerPage, 0);
    const query = {
      ...(section ? { section } : {}),
    };
    const [count, users] = await Promise.all([
      this.userModel.find(query).count(),
      this.userModel
        .find(query)
        .sort({
          score: -1,
        })
        .skip(refinedPage)
        .limit(docPerPage)
        .exec(),
    ]);
    return {
      count,
      users: users.map((user, index) => {
        const { username, score } = user;
        const rank = refinedPage * docPerPage + index + 1;
        return {
          rank,
          score,
          username,
        };
      }),
    };
  }

  async changePassword(username: string, password: string) {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new Error("User Not Found");
    }
    user.hashedPassword = await hashPassword(password);
    await user.save();
  }

  async getUserFromToken(token: string) {
    const userId = await validateToken(token);
    if (!userId) {
      return null;
    }

    return await this.findOne({ username: userId });
  }
}
