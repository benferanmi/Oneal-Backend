import { NextFunction, Request, Response } from "express";
import { FileUploadService } from "../../services/FileUploadService";
import { sendSuccessResponse } from "../../utils/helpers";
import { HTTP_STATUS } from "../../utils/constants";
import { AppError } from "../../utils/errors";

export const PublicUploadController = {
  getSignature: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // You can extract a custom folder from req.query or req.body if needed,
      // but defaulting to 'oneals/leads' matches previous behavior.
      const folder = (req.query.folder as string) || "oneals/leads";
      const signatureData = FileUploadService.generateSignature(folder);
      
      return sendSuccessResponse(
        res,
        signatureData,
        "Upload signature generated",
        HTTP_STATUS.OK
      );
    } catch (err) {
      next(err);
    }
  },
};
