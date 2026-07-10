import { NextFunction, Request, Response } from "express";
import { AdminAuthService } from "../../services/AdminAuthService";
import { sendSuccessResponse } from "../../utils/helpers";
import { HTTP_STATUS } from "../../utils/constants";

export const AdminAuthController = {
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as { email: string; password: string };
      const result = await AdminAuthService.login(email, password);
      return sendSuccessResponse(res, result, "Login successful");
    } catch (err) {
      next(err);
    }
  },

  createAdmin: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const admin = await AdminAuthService.createAdmin(req.body);
      return sendSuccessResponse(res, admin, "Admin created", HTTP_STATUS.CREATED);
    } catch (err) {
      next(err);
    }
  },

  me: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { AdminUserRepository } = await import("../../repositories/AdminUserRepository");
      const user = await AdminUserRepository.findById(req.admin!.sub);
      if (!user || !user.isActive) return res.status(401).json({ success: false, message: "Unauthorized" });
      return sendSuccessResponse(res, user.toJSON(), "Current admin");
    } catch (err) {
      next(err);
    }
  },
  changePassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const { AdminUserRepository } = await import("../../repositories/AdminUserRepository");
      const bcrypt = await import("bcryptjs");
      const { AppError } = await import("../../utils/errors");
      const user = await AdminUserRepository.findById(req.admin!.sub);
      if (!user) throw AppError.unauthorized("Unauthorized");

      const ok = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!ok) throw AppError.badRequest("Invalid current password");

      user.passwordHash = await bcrypt.hash(newPassword, 10);
      await user.save();
      
      return sendSuccessResponse(res, { ok: true }, "Password changed");
    } catch (err) {
      next(err);
    }
  },
};
