import { Schema, model, Document } from "mongoose";
import { BlockedDate as BlockedDateType } from "../types/models";

export interface BlockedDateDoc extends Omit<BlockedDateType, "id">, Document {}

const BlockedDateSchema = new Schema(
  {
    date: { type: String, required: true, unique: true, index: true },
    reason: String,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = String(ret._id);
        delete ret._id;
        return ret;
      },
    },
  }
);

export const BlockedDateModel = model<BlockedDateDoc>("BlockedDate", BlockedDateSchema);
