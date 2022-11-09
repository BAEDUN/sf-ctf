import jwt from "jsonwebtoken";
import { Config } from "../../config";

export default function validateToken(token: string) {
  try {
    const payload = jwt.verify(token, Config.JWT_SECRET, {});
    let userId = (payload as any)["userId"];
    if (typeof userId === "string") {
      return userId;
    }
  } catch (error) {
    console.error(error);
  }
  return null;
}
