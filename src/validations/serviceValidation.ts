import Joi from "joi";
import { PRICE_TYPES, SERVICE_CATEGORIES } from "../types/models";

export const createServiceSchema = Joi.object({
  slug: Joi.string().pattern(/^[a-z0-9-]+$/).required(),
  name: Joi.string().min(2).max(120).required(),
  shortDescription: Joi.string().min(2).max(300).required(),
  fullDescription: Joi.string().min(2).max(5000).required(),
  category: Joi.string().valid(...SERVICE_CATEGORIES).required(),
  priceType: Joi.string().valid(...PRICE_TYPES).required(),
  price: Joi.number().min(0).optional(),
  durationNote: Joi.string().max(200).optional(),
  durationMinutesMin: Joi.number().min(0).optional(),
  durationMinutesMax: Joi.number().min(0).optional(),
  image: Joi.string().uri().optional(),
  gallery: Joi.array().items(Joi.string().uri()).optional(),
  isActive: Joi.boolean().default(true),
  isFeatured: Joi.boolean().default(false),
  displayOrder: Joi.number().integer().default(0),
});

export const updateServiceSchema = createServiceSchema.fork(
  Object.keys(createServiceSchema.describe().keys),
  (s) => s.optional()
).min(1);
