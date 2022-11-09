import { Config } from "../config";

export default function isServerStarted() {
  return Config.START_AT.getMilliseconds() <= Date.now();
}
