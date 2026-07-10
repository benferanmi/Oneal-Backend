import { NextFunction, Request, Response } from "express";
import { DashboardService } from "../../services/DashboardService";
import { sendSuccessResponse } from "../../utils/helpers";

export const AdminDashboardController = {
  summary: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await DashboardService.getSummary();
      return sendSuccessResponse(res, stats, "Dashboard summary");
    } catch (err) {
      next(err);
    }
  },
};
