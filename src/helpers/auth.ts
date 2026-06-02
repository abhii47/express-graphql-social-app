import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { getEnv } from "../config/env";
import { unauthorizedError } from "./errors";

type AuthContext = {
  token?: string;
};

type AuthTokenPayload = JwtPayload & {
  user_id: number;
};

const getBearerToken = (authorization?: string) => {
  if (!authorization) return null;
  return authorization.replace("Bearer ", "").trim();
};

export const authenticate = ({ token }: AuthContext) => {
  const bearerToken = getBearerToken(token);

  if (!bearerToken) {
    throw unauthorizedError();
  }

  try {
    const decoded = jwt.verify(bearerToken, getEnv("JWT_SECRET"));

    if (typeof decoded === "string" || !decoded.user_id) {
      throw unauthorizedError("Invalid token payload");
    }

    return decoded as AuthTokenPayload;
  } catch {
    throw unauthorizedError("Invalid or expired token");
  }
};

export const signAuthToken = (userId: number) => {
  const expiresIn = getEnv("JWT_EXPIRES_IN", "1h") as SignOptions["expiresIn"];

  return jwt.sign({ user_id: userId }, getEnv("JWT_SECRET"), { expiresIn });
};