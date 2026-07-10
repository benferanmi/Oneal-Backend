import { Router } from "express";
import { PublicLeadController } from "../../controllers/public/LeadController";
import { validate } from "../../middlewares/validation";
import { createLeadSchema } from "../../validations/leadValidation";
import { leadCreateLimiter } from "../../middlewares/rateLimiter";

const router = Router();

router.post("/", leadCreateLimiter, validate(createLeadSchema), PublicLeadController.create);

export default router;
