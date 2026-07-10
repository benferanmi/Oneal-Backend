import { Router } from "express";
import { PublicAvailabilityController } from "../../controllers/public/AvailabilityController";

const router = Router();
router.get("/", PublicAvailabilityController.get);
export default router;
