import { ServiceRepository } from "../repositories/ServiceRepository";
import { CreateServiceInput, Service, UpdateServiceInput } from "../types/models";
import { AppError } from "../utils/errors";

class ServiceManagementServiceImpl {
  async listPublic(): Promise<Service[]> {
    const docs = await ServiceRepository.listPublic();
    return docs.map((d) => d.toJSON() as unknown as Service);
  }
  async listAll(): Promise<Service[]> {
    const docs = await ServiceRepository.listAll();
    return docs.map((d) => d.toJSON() as unknown as Service);
  }
  async create(input: CreateServiceInput): Promise<Service> {
    const existing = await ServiceRepository.findBySlug(input.slug);
    if (existing) throw AppError.conflict("A service with this slug already exists");
    const doc = await ServiceRepository.create(input as never);
    return doc.toJSON() as unknown as Service;
  }
  async update(id: string, patch: UpdateServiceInput): Promise<Service> {
    const doc = await ServiceRepository.updateById(id, patch as never);
    if (!doc) throw AppError.notFound("Service not found");
    return doc.toJSON() as unknown as Service;
  }
  async delete(id: string): Promise<void> {
    const doc = await ServiceRepository.deleteById(id);
    if (!doc) throw AppError.notFound("Service not found");
  }
}

export const ServiceManagementService = new ServiceManagementServiceImpl();
