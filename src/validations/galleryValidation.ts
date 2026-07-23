import Joi from "joi";

export const createGallerySchema = Joi.object({
  title: Joi.string().max(120).optional(),
  mediaType: Joi.string().valid("image", "video").default("image"),
  beforeImage: Joi.string().uri().required(),
  afterImage: Joi.string().uri().optional(),
  caption: Joi.string().max(500).optional(),
  relatedServiceId: Joi.string().optional(),
  isPublished: Joi.boolean().default(true),
  displayOrder: Joi.number().integer().default(0),
});

export const updateGallerySchema = createGallerySchema.fork(
  Object.keys(createGallerySchema.describe().keys),
  (s) => s.optional()
).min(1);
