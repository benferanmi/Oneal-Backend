import { Router } from "express";
import { PublicGalleryController } from "../../controllers/public/GalleryController";

const router = Router();
router.get("/", PublicGalleryController.list);
export default router;
