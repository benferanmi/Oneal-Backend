import { Router } from "express";
import { AdminAvailabilityController } from "../../controllers/admin/AvailabilityManagementController";
import { adminAuth } from "../../middlewares/adminAuth";
import { validate } from "../../middlewares/validation";
import {
  createBlockedDateSchema,
  updateAvailabilitySchema,
} from "../../validations/availabilityValidation";

const router = Router();
router.use(adminAuth);

router.get("/", AdminAvailabilityController.getConfig);
router.put("/", validate(updateAvailabilitySchema), AdminAvailabilityController.updateConfig);

router.get("/blocked-dates", AdminAvailabilityController.listBlocked);
router.post(
  "/blocked-dates",
  validate(createBlockedDateSchema),
  AdminAvailabilityController.createBlocked
);
router.delete("/blocked-dates/:id", AdminAvailabilityController.deleteBlocked);

export default router;
