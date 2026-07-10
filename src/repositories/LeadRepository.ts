import { LeadModel, LeadDoc } from "../models/Lead";
import { BaseRepository } from "./BaseRepository";
import { LeadStatus } from "../types/models";

class LeadRepositoryImpl extends BaseRepository<LeadDoc> {
  async listPaginated(opts: {
    status?: LeadStatus;
    skip: number;
    limit: number;
  }) {
    const filter: Record<string, unknown> = {};
    if (opts.status) filter.status = opts.status;

    const [items, total] = await Promise.all([
      this.model.find(filter).sort({ createdAt: -1 }).skip(opts.skip).limit(opts.limit),
      this.model.countDocuments(filter),
    ]);
    return { items, total };
  }

  countByStatus() {
    return this.model.aggregate<{ _id: LeadStatus; count: number }>([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
  }

  countScheduledOnDate(isoDate: string) {
    return this.model.countDocuments({ status: "scheduled", preferredDate: isoDate });
  }

  upcomingScheduled(limit = 10) {
    return this.model
      .find({ status: "scheduled" })
      .sort({ preferredDate: 1 })
      .limit(limit);
  }

  countSince(sinceISO: string) {
    return this.model.countDocuments({ createdAt: { $gte: new Date(sinceISO) } });
  }
}

export const LeadRepository = new LeadRepositoryImpl(LeadModel);
