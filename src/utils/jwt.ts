import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import { AdminRole } from "../types/models";

export interface AdminJwtPayload {
  sub: string; // admin id
  email: string;
  role: AdminRole;
}

export function signAdminToken(payload: AdminJwtPayload): string {
  const opts: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"] };
  return jwt.sign(payload, env.JWT_SECRET, opts);
}

export function verifyAdminToken(token: string): AdminJwtPayload {
  return jwt.verify(token, env.JWT_SECRET) as AdminJwtPayload;
}
