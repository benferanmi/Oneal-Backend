import { NextFunction, Request, Response } from "express";
import { LeadService } from "../../services/LeadService";
import { sendSuccessResponse } from "../../utils/helpers";
import { HTTP_STATUS } from "../../utils/constants";
import { CreateLeadInput } from "../../types/models";

export const PublicLeadController = {
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const lead = await LeadService.create(req.body as CreateLeadInput);
      return sendSuccessResponse(res, lead, "Lead submitted", HTTP_STATUS.CREATED);
    } catch (err) {
      next(err);
    }
  },
};
