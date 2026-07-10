import { Model, FilterQuery, UpdateQuery, Document } from "mongoose";

export class BaseRepository<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  create(data: Partial<T>) {
    return this.model.create(data);
  }

  findById(id: string) {
    return this.model.findById(id);
  }

  findOne(filter: FilterQuery<T>) {
    return this.model.findOne(filter);
  }

  find(filter: FilterQuery<T> = {}) {
    return this.model.find(filter);
  }

  updateById(id: string, update: UpdateQuery<T>) {
    return this.model.findByIdAndUpdate(id, update, { new: true, runValidators: true });
  }

  deleteById(id: string) {
    return this.model.findByIdAndDelete(id);
  }

  count(filter: FilterQuery<T> = {}) {
    return this.model.countDocuments(filter);
  }
}
