import { Injectable, OnModuleInit } from "@nestjs/common";
import { Config } from "./config";
import { Section } from "./user/schemas/user.schema";
import { UsersService } from "./user/users.service";

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private userService: UsersService) {}

  onModuleInit() {
    this.userService
      .create({
        username: Config.SERVER_ROOT_USER,
        email: "sf.secu@gmail.com",
        password: Config.SERVER_ROOT_PASSWORD,
        nickname: "SecurityFirst",
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
