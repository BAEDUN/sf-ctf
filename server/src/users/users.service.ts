import { FilterQuery, Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./schemas/user.schema";
import { RegisterRequestDto } from "./dto/register.dto";
import hashPassword from "../auth/util/hashPassword";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) {}

  public async create(createUserDto: RegisterRequestDto): Promise<User> {
    const hashedPassword = await hashPassword(createUserDto.password);
    const createdCat = new this.userModel({
      ...createUserDto,
      hashedPassword,
    });
    return createdCat.save();
  }

  async findAll(query: FilterQuery<UserDocument>): Promise<User[]> {
    return this.userModel.find(query).exec();
  }

  async findOne(query: FilterQuery<UserDocument>): Promise<User | null> {
    return this.userModel.findOne(query);
  }
}
