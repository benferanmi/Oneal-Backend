import { NextFunction, Request, Response } from "express";
import { AvailabilityService } from "../../services/AvailabilityService";
import { sendSuccessResponse } from "../../utils/helpers";
import { HTTP_STATUS } from "../../utils/constants";

export const AdminAvailabilityController = {
  getConfig: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const config = await AvailabilityService.getConfig();
      return sendSuccessResponse(res, config, "Availability config");
    } catch (err) {
      next(err);
    }
  },
  updateConfig: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const config = await AvailabilityService.updateConfig(req.body);
      return sendSuccessResponse(res, config, "Availability updated");
    } catch (err) {
      next(err);
    }
  },
  listBlocked: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await AvailabilityService.listBlocked();
      return sendSuccessResponse(res, items, "Blocked dates");
    } catch (err) {
      next(err);
    }
  },
  createBlocked: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await AvailabilityService.createBlocked(req.body);
      return sendSuccessResponse(res, item, "Blocked date created", HTTP_STATUS.CREATED);
    } catch (err) {
      next(err);
    }
  },
  deleteBlocked: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await AvailabilityService.deleteBlocked(req.params.id);
      return sendSuccessResponse(res, { ok: true }, "Blocked date deleted");
    } catch (err) {
      next(err);
    }
  },
};
