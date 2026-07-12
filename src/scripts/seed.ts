/**
 * Seed script — creates the initial admin user, the initial service catalog, and testimonials.
 * Run with: npm run seed
 */
import { connectDatabase, disconnectDatabase } from "../config/database";
import { AdminAuthService } from "../services/AdminAuthService";
import { AdminUserRepository } from "../repositories/AdminUserRepository";
import { ServiceRepository } from "../repositories/ServiceRepository";
import { Testimonial } from "../models/Testimonial";
import { env } from "../config/env";
import { CreateServiceInput } from "../types/models";
import { logger } from "../logger";

const INITIAL_SERVICES: CreateServiceInput[] = [
  {
    slug: "standard-wash-detail",
    name: "Standard Wash & Detail",
    shortDescription: "Exterior hand wash, interior vacuum and wipe-down.",
    fullDescription:
      "A thorough exterior hand wash, tire and wheel cleaning, interior vacuum, dashboard and door-panel wipe-down, and window cleaning inside and out.",
    category: "standard",
    priceType: "starting_at",
    price: 75,
    durationMinutesMin: 90,
    durationMinutesMax: 150,
    isActive: true,
    isFeatured: false,
    displayOrder: 10,
  },
  {
    slug: "premium-detail-package",
    name: "Premium Detail Package",
    shortDescription: "Full interior + exterior deep detail.",
    fullDescription:
      "Complete deep clean inside and out: exterior decontamination, clay bar, hand wax, full interior shampoo, leather conditioning, and trim restoration.",
    category: "premium",
    priceType: "quote_only",
    durationNote: "Minimum 8 hours, depending on vehicle size and condition",
    durationMinutesMin: 480,
    isActive: true,
    isFeatured: false,
    displayOrder: 20,
  },
  {
    slug: "buffing-polishing",
    name: "Buffing & Polishing",
    shortDescription: "Multi-stage paint correction — coming soon.",
    fullDescription: "Machine buffing and polishing to remove swirl marks and light oxidation, restoring depth and clarity to the paint. Pricing available on request once launched.",
    category: "premium",
    priceType: "quote_only",
    image: "https://images.unsplash.com/photo-1620584898989-d39f7f9ed1b7?auto=format&fit=crop&w=1200&q=80",
    isActive: false,
    isFeatured: false,
    displayOrder: 20,
  },
  {
    slug: "ceramic-coating",
    name: "Ceramic Coating",
    shortDescription: "Full-body ceramic coating — coming soon.",
    fullDescription: "A full-body hydrophobic ceramic layer for long-term gloss, UV resistance, and easier washing. Pricing available on request once launched.",
    category: "premium",
    priceType: "quote_only",
    image: "https://images.unsplash.com/photo-1719119985017-80108e084bc0?auto=format&fit=crop&w=1200&q=80",
    isActive: false,
    isFeatured: false,
    displayOrder: 21,
  },
  {
    slug: "headlight-restoration",
    name: "Headlight Restoration",
    shortDescription: "Clarity restoration for oxidized headlights — coming soon.",
    fullDescription: "Wet-sanding and polishing to clear cloudy, UV-oxidized headlight lenses, restoring visibility and a cleaner look. Pricing available on request once launched.",
    category: "addon",
    priceType: "quote_only",
    image: "https://images.unsplash.com/photo-1631856507219-d1f3465b4884?auto=format&fit=crop&w=1200&q=80",
    isActive: false,
    isFeatured: false,
    displayOrder: 22,
  }
];

const INITIAL_TESTIMONIALS = [
  { 
    name: "John D.", 
    rating: 5, 
    content: "Absolutely stunning work on my F-150. Looks better than when I drove it off the lot.",
    isPublished: true,
    displayOrder: 1
  },
  { 
    name: "Sarah W.", 
    rating: 5, 
    content: "The mobile unit is so convenient. They detailed my car while I was working from home.",
    isPublished: true,
    displayOrder: 2
  },
  { 
    name: "Mike R.", 
    rating: 5, 
    content: "Three generations of experience really shows. Their ceramic coating is flawless.",
    isPublished: true,
    displayOrder: 3
  }
];

async function seed() {
  await connectDatabase();

  // Admin
  const existingAdmin = await AdminUserRepository.findByEmail(env.SEED_ADMIN_EMAIL);
  if (existingAdmin) {
    logger.info(`Admin already exists: ${env.SEED_ADMIN_EMAIL}`);
  } else {
    await AdminAuthService.createAdmin({
      name: env.SEED_ADMIN_NAME,
      email: env.SEED_ADMIN_EMAIL,
      password: env.SEED_ADMIN_PASSWORD,
      role: "owner",
    });
    logger.info(`Created admin: ${env.SEED_ADMIN_EMAIL}`);
  }

  // Services
  for (const svc of INITIAL_SERVICES) {
    const existing = await ServiceRepository.findBySlug(svc.slug);
    if (existing) {
      logger.info(`Service already exists: ${svc.slug}, updating...`);
      // Update it in case the user wants to overwrite with the new format/images
      Object.assign(existing, svc);
      await existing.save();
    } else {
      await ServiceRepository.create(svc as never);
      logger.info(`Created service: ${svc.slug}`);
    }
  }

  // Testimonials
  const existingTestimonials = await Testimonial.countDocuments();
  if (existingTestimonials === 0) {
    await Testimonial.insertMany(INITIAL_TESTIMONIALS);
    logger.info(`Created ${INITIAL_TESTIMONIALS.length} testimonials`);
  } else {
    logger.info(`Testimonials already seeded (${existingTestimonials} found)`);
  }

  await disconnectDatabase();
  logger.info("Seed complete");
}

seed().catch(async (err) => {
  logger.error("Seed failed", { err });
  await disconnectDatabase().catch(() => undefined);
  process.exit(1);
});
