import Joi from "joi";
import { DAYS_OF_WEEK } from "../types/models";

export const updateAvailabilitySchema = Joi.object({
  workingDays: Joi.array().items(Joi.string().valid(...DAYS_OF_WEEK)).optional(),
  timeSlots: Joi.array().items(Joi.string()).optional(),
  bookingLeadTimeHours: Joi.number().integer().min(0).max(720).optional(),
  maxBookingsPerDay: Joi.number().integer().min(1).max(50).optional(),
}).min(1);

export const createBlockedDateSchema = Joi.object({
  date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
  reason: Joi.string().max(200).optional(),
});
