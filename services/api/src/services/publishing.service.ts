// ============================================================================
// @tanmayee/api — Publishing Engine Service
// ============================================================================

import { refreshPublishedCatalog } from '@tanmayee/database';
import { adminRepository } from '../repositories/admin.repository';

export class PublishingService {
  /**
   * Refreshes published catalog materialized view
   */
  async refreshCatalog(userId?: string): Promise<{ success: boolean; refreshed_at: string }> {
    await refreshPublishedCatalog();

    if (userId) {
      await adminRepository.recordAudit({
        user_id: userId,
        action: 'REFRESH_PUBLISHED_CATALOG',
      });
    }

    return {
      success: true,
      refreshed_at: new Date().toISOString(),
    };
  }
}

export const publishingService = new PublishingService();
