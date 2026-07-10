import { NextFunction, Request, Response } from "express";
import { GalleryService } from "../../services/GalleryService";
import { sendSuccessResponse } from "../../utils/helpers";

export const PublicGalleryController = {
  list: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await GalleryService.listPublic();
      return sendSuccessResponse(res, items, "Gallery fetched");
    } catch (err) {
      next(err);
    }
  },
};
