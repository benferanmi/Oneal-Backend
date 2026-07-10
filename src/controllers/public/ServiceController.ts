import { NextFunction, Request, Response } from "express";
import { ServiceManagementService } from "../../services/ServiceManagementService";
import { sendSuccessResponse } from "../../utils/helpers";

export const PublicServiceController = {
  list: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const services = await ServiceManagementService.listPublic();
      return sendSuccessResponse(res, services, "Services fetched");
    } catch (err) {
      next(err);
    }
  },
};
