// ============================================================================
// @tanmayee/api — Admin Media Controller
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import { getSupabaseAdmin, isSupabaseConfigured } from '@tanmayee/database';
import { adminRepository } from '../../repositories/admin.repository';
import { AppError } from '../../middleware/error-handler.middleware';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export class MediaAdminController {
  async upload(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const file = req.file;
      if (!file) {
        throw new AppError('No file provided for upload', 400, 'NO_FILE_PROVIDED');
      }

      const ext = path.extname(file.originalname);
      const filename = `${uuidv4()}${ext}`;
      let publicUrl = `/uploads/${filename}`;

      const supabase = getSupabaseAdmin();
      if (isSupabaseConfigured() && supabase) {
        try {
          const { error: uploadError } = await supabase.storage
            .from('catalog-media')
            .upload(filename, file.buffer, {
              contentType: file.mimetype,
              upsert: true,
            });

          if (!uploadError) {
            const { data } = supabase.storage.from('catalog-media').getPublicUrl(filename);
            publicUrl = data.publicUrl;
          }
        } catch (err) {
          console.warn('Supabase storage upload fallback:', err);
        }
      }

      await adminRepository.recordAudit({
        user_id: req.user?.id,
        action: 'MEDIA_UPLOAD',
        entity_type: 'media',
        new_value: { originalname: file.originalname, publicUrl, size: file.size },
      });

      res.status(201).json({
        success: true,
        data: {
          url: publicUrl,
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}

export const mediaAdminController = new MediaAdminController();
