import { Router } from "express";
import { PublicServiceController } from "../../controllers/public/ServiceController";

const router = Router();
router.get("/", PublicServiceController.list);
export default router;
