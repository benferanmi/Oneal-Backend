import { GalleryRepository } from "../repositories/GalleryRepository";
import { CreateGalleryItemInput, GalleryItem, UpdateGalleryItemInput } from "../types/models";
import { AppError } from "../utils/errors";

class GalleryServiceImpl {
  async listPublic(): Promise<GalleryItem[]> {
    const docs = await GalleryRepository.listPublic();
    return docs.map((d) => d.toJSON() as unknown as GalleryItem);
  }
  async listAll(): Promise<GalleryItem[]> {
    const docs = await GalleryRepository.listAll();
    return docs.map((d) => d.toJSON() as unknown as GalleryItem);
  }
  async create(input: CreateGalleryItemInput): Promise<GalleryItem> {
    const doc = await GalleryRepository.create(input as never);
    return doc.toJSON() as unknown as GalleryItem;
  }
  async update(id: string, patch: UpdateGalleryItemInput): Promise<GalleryItem> {
    const doc = await GalleryRepository.updateById(id, patch as never);
    if (!doc) throw AppError.notFound("Gallery item not found");
    return doc.toJSON() as unknown as GalleryItem;
  }
  async delete(id: string): Promise<void> {
    const doc = await GalleryRepository.deleteById(id);
    if (!doc) throw AppError.notFound("Gallery item not found");
  }
}

export const GalleryService = new GalleryServiceImpl();
