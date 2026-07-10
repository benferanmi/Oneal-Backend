import { Response } from "express";
import { PaginationMeta } from "../types/models";

export function sendSuccessResponse<T>(
  res: Response,
  data: T,
  message = "Success",
  statusCode = 200
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
    path: res.req.originalUrl,
  });
}

export function sendErrorResponse(
  res: Response,
  message: string,
  error: string,
  statusCode = 500,
  details?: unknown
) {
  return res.status(statusCode).json({
    success: false,
    message,
    error,
    details,
    timestamp: new Date().toISOString(),
    path: res.req.originalUrl,
  });
}

export function buildPaginationMeta(
  total: number,
  page: number,
  limit: number
): PaginationMeta {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return {
    total,
    page,
    limit,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

export function sendPaginatedResponse<T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  limit: number,
  message = "Success"
) {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: buildPaginationMeta(total, page, limit),
    timestamp: new Date().toISOString(),
    path: res.req.originalUrl,
  });
}

export function parsePagination(query: Record<string, unknown>) {
  const page = Math.max(1, parseInt(String(query.page ?? "1"), 10) || 1);
  const limit = Math.min(
    100,
    Math.max(1, parseInt(String(query.limit ?? "20"), 10) || 20)
  );
  return { page, limit, skip: (page - 1) * limit };
}
