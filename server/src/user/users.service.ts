import { FilterQuery, Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./schemas/user.schema";
import hashPassword from "./util/hashPassword";
import validateToken from "./util/validateToken";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
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

  async getUserFromToken(token: string) {
    const userId = await validateToken(token);
    if (!userId) {
      return null;
    }

    return await this.findOne({ username: userId });
  }
}
