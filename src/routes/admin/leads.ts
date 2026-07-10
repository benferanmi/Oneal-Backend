import { Router } from "express";
import { AdminLeadController } from "../../controllers/admin/LeadManagementController";
import { adminAuth } from "../../middlewares/adminAuth";
import { validate } from "../../middlewares/validation";
import { listLeadsQuerySchema, updateLeadSchema } from "../../validations/leadValidation";

const router = Router();

router.use(adminAuth);
router.get("/", validate(listLeadsQuerySchema, "query"), AdminLeadController.list);
router.get("/:id", AdminLeadController.getById);
router.put("/:id", validate(updateLeadSchema), AdminLeadController.update);
router.delete("/:id", AdminLeadController.remove);

export default router;
