import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Log, LogDocument, LogType } from "./schemas/log.schema";
import { Model } from "mongoose";
import { query } from "express";

@Injectable()
export class LogService {
  constructor(
    @InjectModel(Log.name)
    private readonly logModel: Model<LogDocument>
  ) {}

  public async get(
    nickname: string | null = null,
    ip: string | null = null,
    page: number = 0
  ) {
    const docPerPage = 25;
    const query = {
      ...(nickname ? { nickname: { $regex: nickname } } : {}),
      ...(ip ? { ip: { $regex: ip } } : {}),
    };

    const [count, logs] = await Promise.all([
      this.logModel.find(query).sort({ createdAt: -1 }).count(),
      this.logModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(Math.max(page * docPerPage, 0))
        .limit(docPerPage)
        .exec(),
    ]);
    return {
      pages: Math.ceil(count / docPerPage),
      logs,
    };
  }

  public async getSolvers(challengeTitle: string, page: number = 0) {
    const docPerPage = 10;
    const query = {
      challengeTitle,
      type: LogType.Submit,
      solved: true,
    };

    const [count, logs] = await Promise.all([
      this.logModel.find(query).sort({ createdAt: -1 }).count(),
      this.logModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(Math.max(page * docPerPage, 0))
        .limit(docPerPage)
        .exec(),
    ]);
    return {
      pages: Math.ceil(count / docPerPage),
      logs,
    };
  }

  public async logLogin(ip: string, username: string, nickname: string) {
    const createdLog = new this.logModel({
      createdAt: Date.now(),
      ip,
      username,
      nickname,
      type: LogType.Login,
    });
    return await createdLog.save();
  }

  public async logDownload(
    ip: string,
    username: string,
    nickname: string,
    filename: string
  ) {
    const createdLog = new this.logModel({
      createdAt: Date.now(),
      ip,
      username,
      nickname,
      type: LogType.Download,
      filename,
    });
    return await createdLog.save();
  }

  public async logSubmitFlag(
    ip: string,
    username: string,
    nickname: string,
    flag: string,
    solved: boolean,
    challengeTitle: string
  ) {
    const createdLog = new this.logModel({
      createdAt: Date.now(),
      ip,
      username,
      nickname,
      type: LogType.Submit,
      flag,
      solved,
      challengeTitle,
    });
    return await createdLog.save();
  }
}
