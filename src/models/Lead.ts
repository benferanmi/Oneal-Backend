import { Schema, model, Document } from "mongoose";
import {
  LEAD_STATUSES,
  LEAD_SOURCES,
  VEHICLE_SIZES,
  VEHICLE_TYPES,
  Lead as LeadType,
} from "../types/models";

export interface LeadDoc extends Omit<LeadType, "id">, Document {}

const AddressSchema = new Schema(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    latitude: Number,
    longitude: Number,
  },
  { _id: false }
);

const VehicleSchema = new Schema(
  {
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    color: String,
    size: { type: String, enum: VEHICLE_SIZES },
    type: { type: String, enum: VEHICLE_TYPES },
  },
  { _id: false }
);

const LeadPhotoSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: String,
    caption: String,
    uploadedAt: { type: String, required: true },
  },
  { _id: false }
);

const LeadSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    vehicle: { type: VehicleSchema, required: true },
    photos: { type: [LeadPhotoSchema], default: [] },
    serviceAddress: AddressSchema,
    interestedServiceIds: { type: [String], default: [] },
    preferredDate: String,
    preferredTimeSlot: String,
    notes: String,
    status: { type: String, enum: LEAD_STATUSES, default: "new", index: true },
    source: { type: String, enum: LEAD_SOURCES, default: "booking_page" },
    quotedPrice: Number,
    internalNotes: String,
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

export const LeadModel = model<LeadDoc>("Lead", LeadSchema);
