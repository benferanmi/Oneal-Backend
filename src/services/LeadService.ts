import { LeadRepository } from "../repositories/LeadRepository";
import { CreateLeadInput, Lead, LeadStatus, UpdateLeadInput } from "../types/models";
import { AppError } from "../utils/errors";
import { EmailService } from "./EmailService";
import { logger } from "../logger";

class LeadServiceImpl {
  async create(input: CreateLeadInput): Promise<Lead> {
    const doc = await LeadRepository.create({
      ...input,
      status: "new",
      source: input.source || "booking_page",
    } as never);
    const lead = doc.toJSON() as unknown as Lead;

    // Fire-and-forget emails
    Promise.all([
      EmailService.sendNewLeadNotification(lead),
      EmailService.sendCustomerConfirmation(lead),
    ]).catch((err) => logger.error("Lead email dispatch error", { err }));

    return lead;
  }

  async list(opts: { status?: LeadStatus; page: number; limit: number; skip: number }) {
    const { items, total } = await LeadRepository.listPaginated(opts);
    return { items: items.map((d) => d.toJSON() as unknown as Lead), total };
  }

  async getById(id: string): Promise<Lead> {
    const doc = await LeadRepository.findById(id);
    if (!doc) throw AppError.notFound("Lead not found");
    return doc.toJSON() as unknown as Lead;
  }

  async update(id: string, patch: UpdateLeadInput): Promise<Lead> {
    const doc = await LeadRepository.updateById(id, patch as never);
    if (!doc) throw AppError.notFound("Lead not found");
    return doc.toJSON() as unknown as Lead;
  }

  async delete(id: string): Promise<void> {
    const doc = await LeadRepository.deleteById(id);
    if (!doc) throw AppError.notFound("Lead not found");
  }
}

export const LeadService = new LeadServiceImpl();
