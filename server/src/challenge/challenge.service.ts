import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CreateChallengeRequestDto } from "./dto/createChallenge.dto";
import { Challenge, ChallengeDocument } from "./schemas/challenge.schema";

@Injectable()
export class ChallengeService {
  constructor(
    @InjectModel(Challenge.name)
    private readonly challengeModel: Model<ChallengeDocument>
  ) {}

  public async create(request: CreateChallengeRequestDto): Promise<Challenge> {
    const createdChallenge = new this.challengeModel(request);
    return createdChallenge.save();
  }

  public async get(title: string): Promise<Challenge | null> {
    return this.challengeModel.findOne({
      title,
    });
  }

  public async getAll(): Promise<Challenge[]> {
    return this.challengeModel.find().exec();
  }
}
