import { Router } from "express";
import { Testimonial } from "../../models/Testimonial";
import { getCache, setCache } from "../../utils/cache";

const router = Router();
const CACHE_KEY = "testimonials_public";

router.get("/", async (req, res) => {
  try {
    const cached = getCache(CACHE_KEY);
    if (cached) {
      return res.json(cached);
    }

    const testimonials = await Testimonial.find({ isPublished: true })
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();
      
    // Transform _id to id
    const formatted = testimonials.map((t: any) => ({
      ...t,
      id: t._id.toString(),
      _id: undefined,
      __v: undefined,
    }));

    setCache(CACHE_KEY, formatted, 3600); // Cache for 1 hour
    
    // Add stale-while-revalidate for CDN caching
    res.setHeader("Cache-Control", "public, max-age=300, stale-while-revalidate=86400");
    res.json(formatted);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    res.status(500).json({ error: "Failed to fetch testimonials" });
  }
});

export default router;
