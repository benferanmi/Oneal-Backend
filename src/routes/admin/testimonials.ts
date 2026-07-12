import { Router } from "express";
import { adminAuth } from "../../middlewares/adminAuth";
import { Testimonial } from "../../models/Testimonial";
import { clearCache } from "../../utils/cache";

const router = Router();
const CACHE_KEY = "testimonials_public";

router.use(adminAuth);

router.get("/", async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    // Transform _id to id for consistency
    const formatted = testimonials.map(t => {
      const obj = t.toObject();
      return { ...obj, id: obj._id.toString() };
    });
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch testimonials" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, rating, content, isPublished, displayOrder } = req.body;
    const newTestimonial = new Testimonial({ name, rating, content, isPublished, displayOrder });
    await newTestimonial.save();
    clearCache(CACHE_KEY);
    
    const obj = newTestimonial.toObject();
    res.status(201).json({ ...obj, id: obj._id.toString() });
  } catch (err) {
    res.status(500).json({ error: "Failed to create testimonial" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    clearCache(CACHE_KEY);
    if (!updated) {
      return res.status(404).json({ error: "Not found" });
    }
    const obj = updated.toObject();
    res.json({ ...obj, id: obj._id.toString() });
  } catch (err) {
    res.status(500).json({ error: "Failed to update testimonial" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    clearCache(CACHE_KEY);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete testimonial" });
  }
});

export default router;
