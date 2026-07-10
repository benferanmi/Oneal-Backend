import { Router } from "express";
import { AdminGalleryController } from "../../controllers/admin/GalleryManagementController";
import { adminAuth } from "../../middlewares/adminAuth";
import { validate } from "../../middlewares/validation";
import { createGallerySchema, updateGallerySchema } from "../../validations/galleryValidation";

const router = Router();
router.use(adminAuth);
router.get("/", AdminGalleryController.list);
router.get("/signature", AdminGalleryController.getSignature);
router.post("/", validate(createGallerySchema), AdminGalleryController.create);
router.put("/:id", validate(updateGallerySchema), AdminGalleryController.update);
router.delete("/:id", AdminGalleryController.remove);

export default router;
