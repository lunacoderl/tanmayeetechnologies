// ============================================================================
// @tanmayee/api — Auth Service
// ============================================================================

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { adminRepository } from '../repositories/admin.repository';
import { config } from '../config/env';
import { AppError } from '../middleware/error-handler.middleware';
import { LoginInput } from '@tanmayee/validation';

export class AuthService {
  async login(input: LoginInput, ipAddress?: string, userAgent?: string) {
    const user = await adminRepository.findByEmail(input.email);

    if (!user) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    if (!user.is_active) {
      throw new AppError('Account is inactive. Please contact your administrator.', 403, 'ACCOUNT_INACTIVE');
    }

    // Check account lockout
    if (user.locked_until && new Date(user.locked_until).getTime() > Date.now()) {
      const waitMinutes = Math.ceil(
        (new Date(user.locked_until).getTime() - Date.now()) / (60 * 1000)
      );
      throw new AppError(
        `Account is temporarily locked due to multiple failed attempts. Try again in ${waitMinutes} minute(s).`,
        429,
        'ACCOUNT_LOCKED'
      );
    }

    const isMatch = await bcrypt.compare(input.password, user.password_hash || '');

    if (!isMatch) {
      await adminRepository.incrementFailedAttempts(user.id);
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    // Reset failed attempts on success
    await adminRepository.resetLoginAttempts(user.id);

    // Audit log
    await adminRepository.recordAudit({
      user_id: user.id,
      action: 'ADMIN_LOGIN_SUCCESS',
      ip_address: ipAddress,
      user_agent: userAgent,
    });

    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.full_name,
    };

    const token = jwt.sign(tokenPayload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn as any,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
      },
    };
  }
}

export const authService = new AuthService();
