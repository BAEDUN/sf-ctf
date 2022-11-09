export const Config = {
  MONGO_ROOT_USERNAME: stringEnv("MONGO_ROOT_USERNAME"),
  MONGO_ROOT_PASSWORD: stringEnv("MONGO_ROOT_PASSWORD"),
  PASSWORD_SALT_ROUNDS: 4,
  ACCESS_TOKEN_EXPIRES_IN: "1h",
  JWT_SECRET: stringEnv("JWT_SECRET"),
  MINIO_ROOT_USER: stringEnv("MINIO_ROOT_USER"),
  MINIO_ROOT_PASSWORD: stringEnv("MINIO_ROOT_PASSWORD"),
  SERVER_ROOT_USER: stringEnv("SERVER_ROOT_USER"),
  SERVER_ROOT_PASSWORD: stringEnv("SERVER_ROOT_PASSWORD"),
  START_AT: dateEnv("START_AT"),
  END_AT: dateEnv("END_AT"),
};

function stringEnv(name: string): string {
  const value = process.env[name];
  if (value) {
    return value;
  }
  throw new Error(`Environment variable ${name} is not set`);
}

function dateEnv(name: string): Date {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is not set`);
  }
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date ${name}: ${value}`);
  }
  return date;
}
