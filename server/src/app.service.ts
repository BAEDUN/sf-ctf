import { Injectable, OnModuleInit } from "@nestjs/common";
import { Config } from "./config";
import { Section } from "./user/schemas/user.schema";
import { UserService } from "./user/users.service";

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private userService: UserService) {}

  onModuleInit() {
    this.userService
      .create({
        username: Config.SERVER_ROOT_USER,
        email: "never",
        password: Config.SERVER_ROOT_PASSWORD,
        nickname: "root",
        isAdmin: true,
        section: Section.SecurityFirst,
      })
      .catch((error) => {
        switch (error.code) {
          case 11000: {
            break;
          }

          default: {
            throw error;
          }
        }
      });
  }
}
