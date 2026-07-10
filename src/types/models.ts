/**
 * ============================================================================
 * O'NEAL'S AUTO DETAILING — SHARED DATA LAYER
 * ============================================================================
 * Single source of truth for all data shapes across the three builds:
 *   1. BACKEND         (owns persistence — adapt these to your DB models)
 *   2. ADMIN DASHBOARD (consumes + mutates this data)
 *   3. PUBLIC WEBSITE  (mostly reads this data + creates Leads)
 * ============================================================================
 */

/* ---------------------------------------------------------------------------- ENUMS -------------------------------------------------------------------------- */

export const LEAD_STATUSES = [
  "new",
  "contacted",
  "quoted",
  "scheduled",
  "completed",
  "cancelled",
  "spam",
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const SERVICE_CATEGORIES = ["standard", "premium", "addon"] as const;
export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];

export const PRICE_TYPES = ["fixed", "starting_at", "quote_only"] as const;
export type PriceType = (typeof PRICE_TYPES)[number];

export const VEHICLE_SIZES = ["sedan", "coupe", "suv", "truck", "van", "other"] as const;
export type VehicleSize = (typeof VEHICLE_SIZES)[number];

export const LEAD_SOURCES = [
  "home_hero",
  "services_page",
  "booking_page",
  "phone",
  "referral",
  "other",
] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

export const DAYS_OF_WEEK = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;
export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

export const ADMIN_ROLES = ["owner", "staff"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

/* ---------------------------------------------------------------------------- SHARED / EMBEDDED TYPES -------------------------------------------------------------------------- */

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
}

export interface VehicleInfo {
  make: string;
  model: string;
  year: number;
  color?: string;
  size?: VehicleSize;
}

export interface LeadPhoto {
  url: string;
  publicId?: string;
  caption?: string;
  uploadedAt: string;
}

/* ---------------------------------------------------------------------------- CORE ENTITY: LEAD -------------------------------------------------------------------------- */

export interface Lead {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  vehicle: VehicleInfo;
  photos: LeadPhoto[];
  serviceAddress?: Address;
  interestedServiceIds?: string[];
  preferredDate?: string;
  preferredTimeSlot?: string;
  notes?: string;
  status: LeadStatus;
  source: LeadSource;
  quotedPrice?: number;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateLeadInput = Omit<
  Lead,
  "id" | "status" | "quotedPrice" | "internalNotes" | "createdAt" | "updatedAt"
>;

export type UpdateLeadInput = Partial<
  Pick<
    Lead,
    "status" | "quotedPrice" | "internalNotes" | "preferredDate" | "preferredTimeSlot"
  >
>;

/* ---------------------------------------------------------------------------- CORE ENTITY: SERVICE -------------------------------------------------------------------------- */

export interface Service {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  category: ServiceCategory;
  priceType: PriceType;
  price?: number;
  durationNote?: string;
  durationMinutesMin?: number;
  durationMinutesMax?: number;
  image?: string;
  gallery?: string[];
  isActive: boolean;
  isFeatured: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export type CreateServiceInput = Omit<Service, "id" | "createdAt" | "updatedAt">;
export type UpdateServiceInput = Partial<CreateServiceInput>;

/* ---------------------------------------------------------------------------- CORE ENTITY: GALLERY ITEM -------------------------------------------------------------------------- */

export interface GalleryItem {
  id: string;
  title?: string;
  beforeImage: string;
  afterImage: string;
  caption?: string;
  relatedServiceId?: string;
  isPublished: boolean;
  displayOrder: number;
  createdAt: string;
}

export type CreateGalleryItemInput = Omit<GalleryItem, "id" | "createdAt">;
export type UpdateGalleryItemInput = Partial<CreateGalleryItemInput>;

/* ---------------------------------------------------------------------------- BOOKING AVAILABILITY -------------------------------------------------------------------------- */

export interface AvailabilityConfig {
  workingDays: DayOfWeek[];
  timeSlots: string[];
  bookingLeadTimeHours: number;
  maxBookingsPerDay: number;
}

export type UpdateAvailabilityConfigInput = Partial<AvailabilityConfig>;

export interface BlockedDate {
  id: string;
  date: string;
  reason?: string;
}

export type CreateBlockedDateInput = Omit<BlockedDate, "id">;

/** Combined public availability payload */
export interface AvailabilityResponse {
  config: AvailabilityConfig;
  openDates: string[]; // ISO dates within the bookable window
  timeSlots: string[]; // Available time slots for the open dates
}

/* ---------------------------------------------------------------------------- ADMIN USER -------------------------------------------------------------------------- */

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

/* ---------------------------------------------------------------------------- ADMIN DASHBOARD SUMMARY -------------------------------------------------------------------------- */

export interface DashboardStats {
  totalLeads: number;
  newLeadsThisWeek: number;
  leadsByStatus: Record<LeadStatus, number>;
  upcomingBookings: Lead[];
  activeServicesCount: number;
  totalGalleryItems: number;
}

/* ---------------------------------------------------------------------------- API RESPONSE ENVELOPE -------------------------------------------------------------------------- */

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  timestamp: string;
  path?: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error: string;
  details?: unknown;
  timestamp: string;
  path?: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  success: true;
  message: string;
  data: T[];
  pagination: PaginationMeta;
  timestamp: string;
  path?: string;
}
