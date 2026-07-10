import { Router } from "express";
import { AdminServiceController } from "../../controllers/admin/ServiceManagementController";
import { adminAuth } from "../../middlewares/adminAuth";
import { validate } from "../../middlewares/validation";
import { createServiceSchema, updateServiceSchema } from "../../validations/serviceValidation";

const router = Router();
router.use(adminAuth);
router.get("/", AdminServiceController.list);
router.post("/", validate(createServiceSchema), AdminServiceController.create);
router.put("/:id", validate(updateServiceSchema), AdminServiceController.update);
router.delete("/:id", AdminServiceController.remove);

export default router;
