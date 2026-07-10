import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors";
import { AdminJwtPayload, verifyAdminToken } from "../utils/jwt";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      admin?: AdminJwtPayload;
    }
  }
}

export function adminAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(AppError.unauthorized("Missing bearer token"));
  }
  const token = header.slice(7).trim();
  try {
    const payload = verifyAdminToken(token);
    req.admin = payload;
    next();
  } catch {
    next(AppError.unauthorized("Invalid or expired token"));
  }
}

export function requireOwner(req: Request, _res: Response, next: NextFunction) {
  if (req.admin?.role !== "owner") return next(AppError.forbidden("Owner role required"));
  next();
}
