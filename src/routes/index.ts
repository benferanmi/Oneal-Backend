import { Router } from "express";

import publicLeads from "./public/leads";
import publicServices from "./public/services";
import publicGallery from "./public/gallery";
import publicAvailability from "./public/availability";
import publicUploads from "./public/uploads";

import adminAuth from "./admin/auth";
import adminDashboard from "./admin/dashboard";
import adminLeads from "./admin/leads";
import adminServices from "./admin/services";
import adminGallery from "./admin/gallery";
import adminAvailability from "./admin/availability";

const router = Router();

// Public
router.use("/leads", publicLeads);
router.use("/services", publicServices);
router.use("/gallery", publicGallery);
router.use("/availability", publicAvailability);
router.use("/uploads", publicUploads);

// Admin
router.use("/admin/auth", adminAuth);
router.use("/admin/dashboard", adminDashboard);
router.use("/admin/leads", adminLeads);
router.use("/admin/services", adminServices);
router.use("/admin/gallery", adminGallery);
router.use("/admin/availability", adminAvailability);

router.get("/health", (_req, res) => {
  res.json({ success: true, message: "ok", data: { status: "healthy" }, timestamp: new Date().toISOString() });
});

export default router;
