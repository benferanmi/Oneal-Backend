import { NextFunction, Request, Response } from "express";
import { ServiceManagementService } from "../../services/ServiceManagementService";
import { sendSuccessResponse } from "../../utils/helpers";
import { HTTP_STATUS } from "../../utils/constants";

export const AdminServiceController = {
  list: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const services = await ServiceManagementService.listAll();
      return sendSuccessResponse(res, services, "Services fetched");
    } catch (err) {
      next(err);
    }
  },
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const svc = await ServiceManagementService.create(req.body);
      return sendSuccessResponse(res, svc, "Service created", HTTP_STATUS.CREATED);
    } catch (err) {
      next(err);
    }
  },
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const svc = await ServiceManagementService.update(req.params.id, req.body);
      return sendSuccessResponse(res, svc, "Service updated");
    } catch (err) {
      next(err);
    }
  },
  remove: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await ServiceManagementService.delete(req.params.id);
      return sendSuccessResponse(res, { ok: true }, "Service deleted");
    } catch (err) {
      next(err);
    }
  },
};
