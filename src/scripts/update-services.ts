import { connectDatabase, disconnectDatabase } from "../config/database";
import { ServiceRepository } from "../repositories/ServiceRepository";
import { logger } from "../logger";

const UPDATED_SERVICES = [
  {
    slug: "standard-wash-detail",
    slugNew: "essential-package",
    name: "Essential Package",
    shortDescription: "Clean. Fresh. Protected. Our standard inside and out reset.",
    fullDescription: "Full interior vacuum, interior surface wipe-down, streak-free windows, door jamb cleaning, floor mats refreshed, exterior wash & wax, and tire shine. Cars: $60-$80 | Trucks/SUVs: $80-$140 | Vans/Large Vehicles: $85-$180. Heavily soiled vehicles may incur up to $25 additional.",
    category: "standard",
    priceType: "starting_at",
    price: 60,
    durationMinutesMin: 120,
    durationMinutesMax: 240,
    isActive: true,
    isFeatured: true,
    displayOrder: 1,
  },
  {
    slug: "premium-detail-package",
    slugNew: "premium-detail-package",
    name: "The O'Neal Touch (Premium Detail)",
    shortDescription: "Our Signature Service — Deep, Detailed, Exceptional.",
    fullDescription: "Every crack. Every crevice. Every inch — restored with care. Your vehicle is treated like our own, delivering a true top-tier finish. Cars: $160 | Trucks/SUVs: $225 | Vans/Large Vehicles: $280.",
    category: "premium",
    priceType: "starting_at",
    price: 160,
    durationNote: "Takes 8 hours minimum depending on size and condition of vehicle",
    isActive: true,
    isFeatured: true,
    displayOrder: 2,
  },
];

async function updateServices() {
  await connectDatabase();

  for (const svc of UPDATED_SERVICES) {
    const existing = await ServiceRepository.findBySlug(svc.slug);
    if (existing) {
      // update
      const { slugNew, slug, ...rest } = svc;
      await existing.updateOne({ $set: { slug: slugNew, ...rest } });
      logger.info(`Updated service: ${svc.slug} to ${slugNew}`);
    } else {
      const existingNew = await ServiceRepository.findBySlug(svc.slugNew);
      if (existingNew) {
        const { slugNew, slug, ...rest } = svc;
        await existingNew.updateOne({ $set: { ...rest } });
        logger.info(`Updated service: ${svc.slugNew}`);
      } else {
        const { slugNew, slug, ...rest } = svc;
        await ServiceRepository.create({ slug: slugNew, ...rest } as never);
        logger.info(`Created service: ${slugNew}`);
      }
    }
  }

  // Deactivate others we don't want displayed currently
  const slugsToHide = [
    "windshield-ceramic-coating", 
    "full-ceramic-coating", 
    "buffing-polishing", 
    "headlight-restoration"
  ];

  for (const slug of slugsToHide) {
    const existing = await ServiceRepository.findBySlug(slug);
    if (existing) {
      await existing.updateOne({ $set: { isActive: false } });
      logger.info(`Deactivated service: ${slug}`);
    }
  }

  await disconnectDatabase();
  logger.info("Update complete");
}

updateServices().catch(async (err) => {
  logger.error("Update failed", { err });
  await disconnectDatabase().catch(() => undefined);
  process.exit(1);
});
