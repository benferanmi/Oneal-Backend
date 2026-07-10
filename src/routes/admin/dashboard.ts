import { Router } from "express";
import { AdminDashboardController } from "../../controllers/admin/DashboardController";
import { adminAuth } from "../../middlewares/adminAuth";

const router = Router();
router.get("/summary", adminAuth, AdminDashboardController.summary);
export default router;
