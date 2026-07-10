import { Router } from "express";
import { PublicUploadController } from "../../controllers/public/UploadController";
import { uploadLimiter } from "../../middlewares/rateLimiter";

const router = Router();

router.get("/signature", uploadLimiter, PublicUploadController.getSignature);

export default router;
