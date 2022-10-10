import jwt from "jsonwebtoken";
import { Config } from "../../config";

export default async function validateToken(token: string) {
  const payload = jwt.verify(token, Config.JWT_SECRET, {});
  let userId = (payload as any)["userId"];
  if (typeof userId !== "string") {
    return { userId };
  }
  throw new Error("Invalid token payload");
}
