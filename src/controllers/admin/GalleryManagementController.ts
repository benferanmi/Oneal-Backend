import { NextFunction, Request, Response } from "express";
import { GalleryService } from "../../services/GalleryService";
import { sendSuccessResponse } from "../../utils/helpers";
import { HTTP_STATUS } from "../../utils/constants";

export const AdminGalleryController = {
  list: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await GalleryService.listAll();
      return sendSuccessResponse(res, items, "Gallery fetched");
    } catch (err) {
      next(err);
    }
  },
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await GalleryService.create(req.body);
      return sendSuccessResponse(res, item, "Gallery item created", HTTP_STATUS.CREATED);
    } catch (err) {
      next(err);
    }
  },
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await GalleryService.update(req.params.id, req.body);
      return sendSuccessResponse(res, item, "Gallery item updated");
    } catch (err) {
      next(err);
    }
  },
  remove: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await GalleryService.delete(req.params.id);
      return sendSuccessResponse(res, { ok: true }, "Gallery item deleted");
    } catch (err) {
      next(err);
    }
  },
  getSignature: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const folder = (req.query.folder as string) || "oneals/gallery";
      const { FileUploadService } = await import("../../services/FileUploadService");
      const signatureData = FileUploadService.generateSignature(folder);
      return sendSuccessResponse(res, signatureData, "Upload signature generated");
    } catch (err) {
      next(err);
    }
  },
};
