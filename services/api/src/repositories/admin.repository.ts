// ============================================================================
// @tanmayee/api — Admin & Audit Log Repository
// ============================================================================

import { AdminUser, AdminAuditLog } from '@tanmayee/types';
import { AdminRole } from '@tanmayee/config';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/env';

// Default initial super admin configured strictly via environment variables
const defaultPasswordHash = bcrypt.hashSync(config.adminPassword, 10);

const inMemoryAdmins: AdminUser[] = [
  {
    id: 'a0000001-0000-0000-0000-000000000001',
    email: config.adminEmail,
    password_hash: defaultPasswordHash,
    full_name: 'Tanmayee Administrator',
    role: AdminRole.SUPER_ADMIN,
    is_active: true,
    mfa_enabled: false,
    mfa_secret: null,
    last_login_at: null,
    login_attempts: 0,
    locked_until: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const inMemoryAuditLogs: AdminAuditLog[] = [];

export class AdminRepository {
  async findByEmail(email: string): Promise<AdminUser | null> {
    const user = inMemoryAdmins.find((u) => u.email.toLowerCase() === email.toLowerCase());
    return user || null;
  }

  async findById(id: string): Promise<AdminUser | null> {
    const user = inMemoryAdmins.find((u) => u.id === id);
    return user || null;
  }

  async incrementFailedAttempts(id: string, maxAttempts = 5): Promise<void> {
    const user = inMemoryAdmins.find((u) => u.id === id);
    if (!user) return;

    user.login_attempts = (user.login_attempts || 0) + 1;
    if (user.login_attempts >= maxAttempts) {
      user.locked_until = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins lock
    }
  }

  async resetLoginAttempts(id: string): Promise<void> {
    const user = inMemoryAdmins.find((u) => u.id === id);
    if (!user) return;
    user.login_attempts = 0;
    user.locked_until = null;
    user.last_login_at = new Date().toISOString();
  }

  async recordAudit(data: {
    user_id?: string | null;
    action: string;
    entity_type?: string;
    entity_id?: string;
    old_value?: any;
    new_value?: any;
    ip_address?: string;
    user_agent?: string;
  }): Promise<AdminAuditLog> {
    const log: AdminAuditLog = {
      id: uuidv4(),
      user_id: data.user_id || null,
      action: data.action,
      entity_type: data.entity_type || null,
      entity_id: data.entity_id || null,
      old_value: data.old_value || null,
      new_value: data.new_value || null,
      ip_address: data.ip_address || null,
      user_agent: data.user_agent || null,
      created_at: new Date().toISOString(),
    };

    inMemoryAuditLogs.unshift(log);
    return log;
  }

  async getAuditLogs(limit = 50) {
    return inMemoryAuditLogs.slice(0, limit);
  }

  async listAdminUsers(): Promise<Omit<AdminUser, 'password_hash' | 'mfa_secret'>[]> {
    return inMemoryAdmins.map((u) => {
      const { password_hash, mfa_secret, ...rest } = u;
      return rest;
    });
  }
}

export const adminRepository = new AdminRepository();
