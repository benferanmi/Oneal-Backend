import { Schema, model, Document } from "mongoose";
import { SERVICE_CATEGORIES, PRICE_TYPES, Service as ServiceType } from "../types/models";

export interface ServiceDoc extends Omit<ServiceType, "id">, Document {}

const ServiceSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    category: { type: String, enum: SERVICE_CATEGORIES, required: true },
    priceType: { type: String, enum: PRICE_TYPES, required: true },
    price: Number,
    priceMin: Number,
    priceMax: Number,
    priceNote: String,
    hasVehicleTypeVariation: { type: Boolean, default: false },
    priceOptions: { type: Schema.Types.Mixed },
    durationNote: String,
    durationMinutesMin: Number,
    durationMinutesMax: Number,
    image: String,
    gallery: { type: [String], default: [] },
    isActive: { type: Boolean, default: true, index: true },
    isFeatured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = String(ret._id);
        delete ret._id;
        if (ret.createdAt instanceof Date) ret.createdAt = ret.createdAt.toISOString();
        if (ret.updatedAt instanceof Date) ret.updatedAt = ret.updatedAt.toISOString();
        return ret;
      },
    },
  }
);

export const ServiceModel = model<ServiceDoc>("Service", ServiceSchema);
