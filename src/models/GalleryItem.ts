import { Schema, model, Document } from "mongoose";
import { GalleryItem as GalleryItemType } from "../types/models";

export interface GalleryItemDoc extends Omit<GalleryItemType, "id">, Document {}

const GalleryItemSchema = new Schema(
  {
    title: String,
    beforeImage: { type: String, required: true },
    afterImage: { type: String, required: true },
    caption: String,
    relatedServiceId: String,
    isPublished: { type: Boolean, default: true, index: true },
    displayOrder: { type: Number, default: 0 },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = String(ret._id);
        delete ret._id;
        if (ret.createdAt instanceof Date) ret.createdAt = ret.createdAt.toISOString();
        return ret;
      },
    },
  }
);

export const GalleryItemModel = model<GalleryItemDoc>("GalleryItem", GalleryItemSchema);
