import bcrypt from "bcrypt";
import { Config } from "../../config";

export default async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(Config.PASSWORD_SALT_ROUNDS);
  return await bcrypt.hash(password, salt);
}
