import jwt from "jsonwebtoken";
import { Config } from "../../config";
import { User } from "../schemas/user.schema";

export default async function issueToken(user: User) {
  const payload = {
    userId: user.username,
  };
  const accessToken = jwt.sign(payload, Config.JWT_SECRET, {
    expiresIn: Config.ACCESS_TOKEN_EXPIRES_IN,
  });
  return accessToken;
}
