import { AvailabilityConfigModel } from "../models/AvailabilityConfig";
import { BlockedDateModel } from "../models/BlockedDate";
import { AvailabilityConfig, BlockedDate, DayOfWeek } from "../types/models";

class AvailabilityRepositoryImpl {
  async getConfig(): Promise<AvailabilityConfig> {
    let doc = await AvailabilityConfigModel.findOne();
    if (!doc) doc = await AvailabilityConfigModel.create({});
    return {
      workingDays: doc.workingDays as DayOfWeek[],
      timeSlots: doc.timeSlots,
      bookingLeadTimeHours: doc.bookingLeadTimeHours,
      maxBookingsPerDay: doc.maxBookingsPerDay,
    };
  }

  async updateConfig(update: Partial<AvailabilityConfig>): Promise<AvailabilityConfig> {
    const doc = await AvailabilityConfigModel.findOneAndUpdate({}, update, {
      new: true,
      upsert: true,
      runValidators: true,
    });
    return {
      workingDays: doc!.workingDays as DayOfWeek[],
      timeSlots: doc!.timeSlots,
      bookingLeadTimeHours: doc!.bookingLeadTimeHours,
      maxBookingsPerDay: doc!.maxBookingsPerDay,
    };
  }

  listBlocked() {
    return BlockedDateModel.find().sort({ date: 1 });
  }
  createBlocked(data: Omit<BlockedDate, "id">) {
    return BlockedDateModel.create(data);
  }
  deleteBlocked(id: string) {
    return BlockedDateModel.findByIdAndDelete(id);
  }
}

export const AvailabilityRepository = new AvailabilityRepositoryImpl();
