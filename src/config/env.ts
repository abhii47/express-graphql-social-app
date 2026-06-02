import "dotenv/config";
import { internalServerError } from "../helpers/errors";

export const getEnv = (key: string, fallback?: string) => {
  const value = process.env[key] ?? fallback;

  if (!value) {
    throw internalServerError(`${key} is not defined`);
  }

  return value;
};
