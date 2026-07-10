import bcrypt from "bcryptjs";
import { AdminUserRepository } from "../repositories/AdminUserRepository";
import { AdminUser, AdminRole } from "../types/models";
import { AppError } from "../utils/errors";
import { signAdminToken } from "../utils/jwt";

class AdminAuthServiceImpl {
  async login(email: string, password: string): Promise<{ token: string; admin: AdminUser }> {
    const user = await AdminUserRepository.findByEmail(email);
    if (!user || !user.isActive) throw AppError.unauthorized("Invalid credentials");

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw AppError.unauthorized("Invalid credentials");

    user.lastLoginAt = new Date().toISOString();
    await user.save();

    const token = signAdminToken({
      sub: String(user._id),
      email: user.email,
      role: user.role as AdminRole,
    });

    return { token, admin: user.toJSON() as unknown as AdminUser };
  }

  async createAdmin(input: {
    name: string;
    email: string;
    password: string;
    role: AdminRole;
  }): Promise<AdminUser> {
    const existing = await AdminUserRepository.findByEmail(input.email);
    if (existing) throw AppError.conflict("An admin with this email already exists");

    const passwordHash = await bcrypt.hash(input.password, 10);
    const doc = await AdminUserRepository.create({
      name: input.name,
      email: input.email.toLowerCase(),
      passwordHash,
      role: input.role,
      isActive: true,
    } as never);
    return doc.toJSON() as unknown as AdminUser;
  }
}

export const AdminAuthService = new AdminAuthServiceImpl();
