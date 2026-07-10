import { Schema, model, Document } from "mongoose";
import { ADMIN_ROLES, AdminUser as AdminUserType } from "../types/models";

export interface AdminUserDoc extends Omit<AdminUserType, "id">, Document {
  passwordHash: string;
}

const AdminUserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ADMIN_ROLES, default: "staff" },
    isActive: { type: Boolean, default: true },
    lastLoginAt: String,
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = String(ret._id);
        delete ret._id;
        delete ret.passwordHash;
        if (ret.createdAt instanceof Date) ret.createdAt = ret.createdAt.toISOString();
        return ret;
      },
    },
  }
);

export const AdminUserModel = model<AdminUserDoc>("AdminUser", AdminUserSchema);
