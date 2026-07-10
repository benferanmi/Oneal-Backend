import { GalleryItemModel, GalleryItemDoc } from "../models/GalleryItem";
import { BaseRepository } from "./BaseRepository";

class GalleryRepositoryImpl extends BaseRepository<GalleryItemDoc> {
  listPublic() {
    return this.model.find({ isPublished: true }).sort({ displayOrder: 1, createdAt: -1 });
  }
  listAll() {
    return this.model.find().sort({ displayOrder: 1, createdAt: -1 });
  }
}

export const GalleryRepository = new GalleryRepositoryImpl(GalleryItemModel);
