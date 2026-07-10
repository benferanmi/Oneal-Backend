import { Schema, model, Document } from "mongoose";
import { DAYS_OF_WEEK, AvailabilityConfig as AvailabilityConfigType } from "../types/models";

export interface AvailabilityConfigDoc extends AvailabilityConfigType, Document {}

const AvailabilityConfigSchema = new Schema(
  {
    workingDays: {
      type: [String],
      enum: DAYS_OF_WEEK,
      default: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
    },
    timeSlots: {
      type: [String],
      default: ["9:00 AM - 11:00 AM", "12:00 PM - 2:00 PM", "3:00 PM - 5:00 PM"],
    },
    bookingLeadTimeHours: { type: Number, default: 24 },
    maxBookingsPerDay: { type: Number, default: 3 },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      transform: (_doc, ret: Record<string, unknown>) => {
        delete ret._id;
        return ret;
      },
    },
  }
);

export const AvailabilityConfigModel = model<AvailabilityConfigDoc>(
  "AvailabilityConfig",
  AvailabilityConfigSchema
);
