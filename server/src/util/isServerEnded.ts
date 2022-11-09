import { Config } from "../config";

export default function isServerEnded() {
  return Config.END_AT.getTime() <= Date.now();
}
