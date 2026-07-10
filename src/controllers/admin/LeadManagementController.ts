import { NextFunction, Request, Response } from "express";
import { LeadService } from "../../services/LeadService";
import { sendPaginatedResponse, sendSuccessResponse, parsePagination } from "../../utils/helpers";
import { LeadStatus, UpdateLeadInput } from "../../types/models";
import { HTTP_STATUS } from "../../utils/constants";

export const AdminLeadController = {
  list: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit, skip } = parsePagination(req.query);
      const status = req.query.status as LeadStatus | undefined;
      const { items, total } = await LeadService.list({ status, page, limit, skip });
      return sendPaginatedResponse(res, items, total, page, limit, "Leads fetched");
    } catch (err) {
      next(err);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const lead = await LeadService.getById(req.params.id);
      return sendSuccessResponse(res, lead, "Lead fetched");
    } catch (err) {
      next(err);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const lead = await LeadService.update(req.params.id, req.body as UpdateLeadInput);
      return sendSuccessResponse(res, lead, "Lead updated");
    } catch (err) {
      next(err);
    }
  },

  remove: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await LeadService.delete(req.params.id);
      return sendSuccessResponse(res, { ok: true }, "Lead deleted");
    } catch (err) {
      next(err);
    }
  },
};
