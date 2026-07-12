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

export const PRICE_TYPES = ["fixed", "starting_at", "quote_only", "variable", "range"] as const;
export type PriceType = (typeof PRICE_TYPES)[number];

export const VEHICLE_TYPES = ["car", "truck_suv", "van_large"] as const;
export type VehicleType = (typeof VEHICLE_TYPES)[number];

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
  type?: VehicleType;
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

export interface PriceOption {
  id: string;
  label: string;
  priceType: PriceType;
  price?: number;
  priceMin?: number;
  priceMax?: number;
  vehicleType?: VehicleType;
}

export interface Service {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  category: ServiceCategory;
  priceType: PriceType;
  price?: number;
  priceMin?: number;
  priceMax?: number;
  priceNote?: string;
  hasVehicleTypeVariation?: boolean;
  priceOptions?: PriceOption[];
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

/* ---------------------------------------------------------------------------- PRICING HELPER FUNCTIONS -------------------------------------------------------------------------- */

export function getPriceForVehicleType(service: Service, vehicleType?: VehicleType): PriceOption | undefined {
  if (!service.hasVehicleTypeVariation || !service.priceOptions) return undefined;
  return service.priceOptions.find(opt => opt.vehicleType === vehicleType);
}

export function formatPriceOption(option?: PriceOption): string {
  if (!option) return "Quote Only";
  if (option.priceType === "fixed" && option.price !== undefined) return `$${option.price}`;
  if (option.priceType === "range" && option.priceMin !== undefined && option.priceMax !== undefined) {
    return `$${option.priceMin} - $${option.priceMax}`;
  }
  if (option.priceType === "starting_at" && option.price !== undefined) {
    return `From $${option.price}`;
  }
  return "Quote Only";
}

export function formatServiceCardPrice(service: Service): string {
  if (service.hasVehicleTypeVariation && service.priceOptions?.length) {
    const prices = service.priceOptions
      .map(opt => opt.priceMin ?? opt.price)
      .filter((p): p is number => p !== undefined);
    if (prices.length > 0) {
      const minPrice = Math.min(...prices);
      return `From $${minPrice}`;
    }
  }
  if (service.priceType === "fixed" && service.price !== undefined) return `$${service.price}`;
  if (service.priceType === "range" && service.priceMin !== undefined && service.priceMax !== undefined) return `$${service.priceMin} - $${service.priceMax}`;
  if (service.priceType === "variable" && service.price !== undefined) return `From $${service.price}`;
  if (service.priceType === "starting_at" && service.price !== undefined) return `From $${service.price}`;
  return "Quote Only";
}

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
