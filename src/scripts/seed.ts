/**
 * Seed script — creates the initial admin user and the initial service catalog.
 * Run with: npm run seed
 */
import { connectDatabase, disconnectDatabase } from "../config/database";
import { AdminAuthService } from "../services/AdminAuthService";
import { AdminUserRepository } from "../repositories/AdminUserRepository";
import { ServiceRepository } from "../repositories/ServiceRepository";
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
    slug: "windshield-ceramic-coating",
    name: "Windshield Ceramic Coating",
    shortDescription: "Current special — hydrophobic ceramic windshield coating.",
    fullDescription:
      "Professional-grade ceramic coating applied to your windshield for improved visibility in rain, easier bug and grime removal, and longer wiper life.",
    category: "addon",
    priceType: "fixed",
    price: 120,
    isActive: true,
    isFeatured: true,
    displayOrder: 5,
  },
  {
    slug: "full-ceramic-coating",
    name: "Full Ceramic Coating",
    shortDescription: "Whole-vehicle long-lasting ceramic paint protection.",
    fullDescription:
      "Multi-layer ceramic coating over paint correction. Long-lasting gloss, hydrophobic finish, and paint protection against UV and contaminants.",
    category: "premium",
    priceType: "quote_only",
    isActive: false,
    isFeatured: false,
    displayOrder: 30,
  },
  {
    slug: "buffing-polishing",
    name: "Buffing & Polishing",
    shortDescription: "Machine polish to remove swirl marks and light scratches.",
    fullDescription:
      "Multi-stage machine polishing to remove swirl marks, oxidation, and light scratches, restoring depth and clarity to your paint.",
    category: "premium",
    priceType: "quote_only",
    isActive: false,
    isFeatured: false,
    displayOrder: 40,
  },
  {
    slug: "headlight-restoration",
    name: "Headlight Restoration",
    shortDescription: "Restore cloudy, yellowed headlights to like-new clarity.",
    fullDescription:
      "Sanding, polishing, and UV-sealing your headlights to remove yellowing and oxidation for safer nighttime driving and a fresher look.",
    category: "addon",
    priceType: "fixed",
    price: 90,
    isActive: false,
    isFeatured: false,
    displayOrder: 50,
  },
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
      logger.info(`Service already exists: ${svc.slug}`);
      continue;
    }
    await ServiceRepository.create(svc as never);
    logger.info(`Created service: ${svc.slug}`);
  }

  await disconnectDatabase();
  logger.info("Seed complete");
}

seed().catch(async (err) => {
  logger.error("Seed failed", { err });
  await disconnectDatabase().catch(() => undefined);
  process.exit(1);
});
