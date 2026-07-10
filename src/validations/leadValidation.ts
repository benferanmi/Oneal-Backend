import Joi from "joi";
import { LEAD_SOURCES, LEAD_STATUSES, VEHICLE_SIZES } from "../types/models";

const addressSchema = Joi.object({
  street: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  zipCode: Joi.string().required(),
  latitude: Joi.number().optional(),
  longitude: Joi.number().optional(),
});

const vehicleSchema = Joi.object({
  make: Joi.string().required(),
  model: Joi.string().required(),
  year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 2).required(),
  color: Joi.string().optional(),
  size: Joi.string().valid(...VEHICLE_SIZES).optional(),
});

const photoSchema = Joi.object({
  url: Joi.string().uri().required(),
  publicId: Joi.string().optional(),
  caption: Joi.string().allow("").optional(),
  uploadedAt: Joi.string().isoDate().required(),
});

export const createLeadSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).required(),
  phone: Joi.string().min(7).max(30).required(),
  email: Joi.string().email().required(),
  vehicle: vehicleSchema.required(),
  photos: Joi.array().items(photoSchema).min(1).required(),
  serviceAddress: addressSchema.required(),
  interestedServiceIds: Joi.array().items(Joi.string()).min(1).required(),
  preferredDate: Joi.string().optional(),
  preferredTimeSlot: Joi.string().optional(),
  notes: Joi.string().allow("").max(2000).optional(),
  source: Joi.string().valid(...LEAD_SOURCES).default("booking_page"),
});

export const updateLeadSchema = Joi.object({
  status: Joi.string().valid(...LEAD_STATUSES).optional(),
  quotedPrice: Joi.number().min(0).optional(),
  internalNotes: Joi.string().allow("").max(4000).optional(),
  preferredDate: Joi.string().optional(),
  preferredTimeSlot: Joi.string().optional(),
}).min(1);

export const listLeadsQuerySchema = Joi.object({
  status: Joi.string().valid(...LEAD_STATUSES).optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});
