import { AvailabilityRepository } from "../repositories/AvailabilityRepository";
import { LeadRepository } from "../repositories/LeadRepository";
import {
  AvailabilityConfig,
  BlockedDate,
  CreateBlockedDateInput,
  DayOfWeek,
  UpdateAvailabilityConfigInput,
} from "../types/models";

const DAY_INDEX: Record<number, DayOfWeek> = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
};

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

class AvailabilityServiceImpl {
  getConfig() {
    return AvailabilityRepository.getConfig();
  }

  updateConfig(patch: UpdateAvailabilityConfigInput) {
    return AvailabilityRepository.updateConfig(patch);
  }

  async listBlocked(): Promise<BlockedDate[]> {
    const docs = await AvailabilityRepository.listBlocked();
    return docs.map((d) => d.toJSON() as unknown as BlockedDate);
  }

  async createBlocked(input: CreateBlockedDateInput): Promise<BlockedDate> {
    const doc = await AvailabilityRepository.createBlocked(input);
    return doc.toJSON() as unknown as BlockedDate;
  }

  async deleteBlocked(id: string): Promise<void> {
    await AvailabilityRepository.deleteBlocked(id);
  }

  /** Compute open dates for the next `daysAhead` days. */
  async getPublicAvailability(daysAhead = 60): Promise<{
    openDates: string[];
    timeSlots: string[];
    config: AvailabilityConfig;
  }> {
    const config = await this.getConfig();
    const blockedDocs = await AvailabilityRepository.listBlocked();
    const blockedSet = new Set(blockedDocs.map((b) => b.date));

    const now = new Date();
    const earliest = new Date(now.getTime() + config.bookingLeadTimeHours * 3600 * 1000);

    const openDates: string[] = [];
    for (let i = 0; i < daysAhead; i++) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      if (d < earliest) continue;

      const dayName = DAY_INDEX[d.getDay()];
      if (!config.workingDays.includes(dayName)) continue;

      const iso = toISODate(d);
      if (blockedSet.has(iso)) continue;

      const scheduledCount = await LeadRepository.countScheduledOnDate(iso);
      if (scheduledCount >= config.maxBookingsPerDay) continue;

      openDates.push(iso);
    }

    return { openDates, timeSlots: config.timeSlots, config };
  }
}

export const AvailabilityService = new AvailabilityServiceImpl();
