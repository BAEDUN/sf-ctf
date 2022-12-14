import jwt from "jsonwebtoken";
import { Config } from "../../config";

export default function validateToken(token: string) {
  try {
    const payload = jwt.verify(token, Config.JWT_SECRET, {
      algorithms: ["HS256"],
    });
    let userId = (payload as any)["userId"];
    if (typeof userId === "string") {
      return userId;
    }
  } catch (error: any) {
    switch (error.message) {
      case "jwt expired":
        return null;
      default:
        console.error(error);
    }
  }
  return null;
}
