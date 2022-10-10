export const Config = {
  MONGO_ROOT_USERNAME: stringEnv("MONGO_ROOT_USERNAME"),
  MONGO_ROOT_PASSWORD: stringEnv("MONGO_ROOT_PASSWORD"),
  PASSWORD_SALT_ROUNDS: 4,
  ACCESS_TOKEN_EXPIRES_IN: "1h",
  JWT_SECRET: stringEnv("JWT_SECRET"),
};

function stringEnv(name: string): string {
  const value = process.env[name];
  if (value) {
    return value;
  }
  throw new Error(`Environment variable ${name} is not set`);
}
