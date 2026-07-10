import { LeadRepository } from "../repositories/LeadRepository";
import { ServiceRepository } from "../repositories/ServiceRepository";
import { GalleryRepository } from "../repositories/GalleryRepository";
import { DashboardStats, Lead, LEAD_STATUSES, LeadStatus } from "../types/models";

class DashboardServiceImpl {
  async getSummary(): Promise<DashboardStats> {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 3600 * 1000).toISOString();

    const [totalLeads, newLeadsThisWeek, statusAgg, upcomingDocs, activeServicesCount, totalGalleryItems] =
      await Promise.all([
        LeadRepository.count(),
        LeadRepository.countSince(weekAgo),
        LeadRepository.countByStatus(),
        LeadRepository.upcomingScheduled(10),
        ServiceRepository.count({ isActive: true }),
        GalleryRepository.count(),
      ]);

    const leadsByStatus = LEAD_STATUSES.reduce((acc, s) => {
      acc[s] = 0;
      return acc;
    }, {} as Record<LeadStatus, number>);
    for (const row of statusAgg) leadsByStatus[row._id] = row.count;

    return {
      totalLeads,
      newLeadsThisWeek,
      leadsByStatus,
      upcomingBookings: upcomingDocs.map((d) => d.toJSON() as unknown as Lead),
      activeServicesCount,
      totalGalleryItems,
    };
  }
}

export const DashboardService = new DashboardServiceImpl();
