/**
 * Seed script — creates the initial admin user, the initial service catalog, and testimonials.
 * Run with: npm run seed
 */
import { connectDatabase, disconnectDatabase } from "../config/database";
import { AdminAuthService } from "../services/AdminAuthService";
import { AdminUserRepository } from "../repositories/AdminUserRepository";
import { ServiceRepository } from "../repositories/ServiceRepository";
import { ServiceModel } from "../models/Service";
import { Testimonial } from "../models/Testimonial";
import { env } from "../config/env";
import { CreateServiceInput } from "../types/models";
import { logger } from "../logger";
import fs from "fs";
import path from "path";

const servicesPath = path.join(__dirname, "../../../services.json");
const comingSoonPath = path.join(__dirname, "../../../coming-soon-services.json");

const activeServices: CreateServiceInput[] = JSON.parse(fs.readFileSync(servicesPath, "utf8"));
const comingSoonServices: CreateServiceInput[] = JSON.parse(fs.readFileSync(comingSoonPath, "utf8"));
const INITIAL_SERVICES = [...activeServices, ...comingSoonServices];


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

  // Clear existing services
  await ServiceModel.deleteMany({});
  logger.info("Cleared existing services");

  // Services
  for (const svc of INITIAL_SERVICES) {
    // Delete any id or date fields that may be in the json files so Mongoose can create fresh ones
    const { id, createdAt, updatedAt, ...serviceData } = svc as any;
    await ServiceRepository.create(serviceData);
    logger.info(`Created service: ${svc.slug}`);
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
