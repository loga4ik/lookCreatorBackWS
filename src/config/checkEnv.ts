import "dotenv/config";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set`);
  }
  return value;
}

// Единая точка правды по env-переменным: если чего-то не хватает в .env,
// сервер упадёт сразу при старте с понятной ошибкой, а не где-то в середине рантайма.
export const env = {
  DATABASE_URL: requireEnv("DATABASE_URL"),
  JWT_SECRET: requireEnv("JWT_SECRET"),
  PORT: process.env.PORT ?? "3000",
};
