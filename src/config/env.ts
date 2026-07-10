import dotenv from "dotenv";
dotenv.config();

function required(name: string, fallback?: string): string {
  const v = process.env[name] ?? fallback;
  if (v === undefined || v === "") {
    throw new Error(`Missing required env var: ${name}`);
  }
  return v;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "4000", 10),

  JWT_SECRET: required("JWT_SECRET", "dev-secret-change-me"),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

  MONGODB_URI: required("MONGODB_URI", "mongodb://localhost:27017/oneals"),

  EMAIL_TRANSPORT: (process.env.EMAIL_TRANSPORT || "gmail") as "gmail" | "mailgun" | "resend",
  EMAIL_FROM: process.env.EMAIL_FROM || "noreply@onealsdetailing.com",
  EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME || "O'Neal's Auto Detailing",
  OWNER_NOTIFICATION_EMAIL:
    process.env.OWNER_NOTIFICATION_EMAIL || "owner@onealsdetailing.com",
  EMAIL_USER: process.env.EMAIL_USER || "",
  EMAIL_PASS: process.env.EMAIL_PASS || "",
  RESEND_API_KEY: process.env.RESEND_API_KEY || "",
  RESEND_FROM: process.env.RESEND_FROM || "",
  MAILGUN_API_KEY: process.env.MAILGUN_API_KEY || "",
  MAILGUN_DOMAIN: process.env.MAILGUN_DOMAIN || "",

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",

  CORS_ORIGIN: (process.env.CORS_ORIGIN || "*")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),

  SEED_ADMIN_EMAIL: process.env.SEED_ADMIN_EMAIL || "owner@onealsdetailing.com",
  SEED_ADMIN_PASSWORD: process.env.SEED_ADMIN_PASSWORD || "changeme123",
  SEED_ADMIN_NAME: process.env.SEED_ADMIN_NAME || "Owner",
};
