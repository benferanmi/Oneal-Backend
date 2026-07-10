import { AdminUserModel, AdminUserDoc } from "../models/AdminUser";
import { BaseRepository } from "./BaseRepository";

class AdminUserRepositoryImpl extends BaseRepository<AdminUserDoc> {
  findByEmail(email: string) {
    return this.model.findOne({ email: email.toLowerCase() });
  }
}

export const AdminUserRepository = new AdminUserRepositoryImpl(AdminUserModel);
