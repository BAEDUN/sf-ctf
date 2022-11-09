import { Config } from "../config";

export default function isServerEnd() {
  return Config.END_AT.getMilliseconds() <= Date.now();
}
