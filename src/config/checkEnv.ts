import "dotenv/config";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set`);
  }
  return value;
}

const jwtSecret = requireEnv("JWT_SECRET");

export default jwtSecret;
