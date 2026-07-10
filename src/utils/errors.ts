import { ERROR_CODES, HTTP_STATUS } from "./constants";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode: number = HTTP_STATUS.INTERNAL,
    errorCode: string = ERROR_CODES.INTERNAL_ERROR,
    details?: unknown
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }

  static notFound(message = "Resource not found") {
    return new AppError(message, HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
  }
  static badRequest(message = "Bad request", details?: unknown) {
    return new AppError(message, HTTP_STATUS.BAD_REQUEST, ERROR_CODES.BAD_REQUEST, details);
  }
  static unauthorized(message = "Unauthorized") {
    return new AppError(message, HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED);
  }
  static forbidden(message = "Forbidden") {
    return new AppError(message, HTTP_STATUS.FORBIDDEN, ERROR_CODES.FORBIDDEN);
  }
  static validation(message = "Validation failed", details?: unknown) {
    return new AppError(message, HTTP_STATUS.UNPROCESSABLE, ERROR_CODES.VALIDATION_ERROR, details);
  }
  static conflict(message = "Conflict") {
    return new AppError(message, HTTP_STATUS.CONFLICT, ERROR_CODES.CONFLICT);
  }
}
