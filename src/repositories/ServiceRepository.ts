import { ServiceModel, ServiceDoc } from "../models/Service";
import { BaseRepository } from "./BaseRepository";

class ServiceRepositoryImpl extends BaseRepository<ServiceDoc> {
  listPublic() {
    return this.model.find({ isActive: true }).sort({ displayOrder: 1, name: 1 });
  }
  listAll() {
    return this.model.find().sort({ displayOrder: 1, name: 1 });
  }
  findBySlug(slug: string) {
    return this.model.findOne({ slug });
  }
}

export const ServiceRepository = new ServiceRepositoryImpl(ServiceModel);
