import { Router } from "express";
import { AdminAuthController } from "../../controllers/admin/AuthController";
import { validate } from "../../middlewares/validation";
import { createAdminSchema, loginSchema } from "../../validations/authValidation";
import { loginLimiter } from "../../middlewares/rateLimiter";
import { adminAuth, requireOwner } from "../../middlewares/adminAuth";

const router = Router();

router.post("/login", loginLimiter, validate(loginSchema), AdminAuthController.login);
router.get("/me", adminAuth, AdminAuthController.me);
router.post("/change-password", adminAuth, AdminAuthController.changePassword);
router.post(
  "/admins",
  adminAuth,
  requireOwner,
  validate(createAdminSchema),
  AdminAuthController.createAdmin
);

export default router;
