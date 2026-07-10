import { NextFunction, Request, Response } from "express";
import { AvailabilityService } from "../../services/AvailabilityService";
import { sendSuccessResponse } from "../../utils/helpers";

export const PublicAvailabilityController = {
  get: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await AvailabilityService.getPublicAvailability(90);
      return sendSuccessResponse(res, data, "Availability fetched");
    } catch (err) {
      next(err);
    }
  },
};
