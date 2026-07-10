import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors";
import { sendErrorResponse } from "../utils/helpers";
import { ERROR_CODES, HTTP_STATUS } from "../utils/constants";
import { logger } from "../logger";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return sendErrorResponse(res, err.message, err.errorCode, err.statusCode, err.details);
  }

  logger.error("Unhandled error", { err });
  const message = err instanceof Error ? err.message : "Internal server error";
  return sendErrorResponse(
    res,
    "Internal server error",
    ERROR_CODES.INTERNAL_ERROR,
    HTTP_STATUS.INTERNAL,
    process.env.NODE_ENV === "production" ? undefined : { message }
  );
}

export function notFoundHandler(req: Request, res: Response) {
  return sendErrorResponse(
    res,
    `Route not found: ${req.method} ${req.originalUrl}`,
    ERROR_CODES.NOT_FOUND,
    HTTP_STATUS.NOT_FOUND
  );
}
