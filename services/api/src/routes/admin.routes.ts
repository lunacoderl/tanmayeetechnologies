// ============================================================================
// @tanmayee/api — Admin API Routes
// ============================================================================

import { Router } from 'express';
import multer from 'multer';
import { adminAuthController } from '../controllers/admin/auth.controller';
import { productAdminController } from '../controllers/admin/product.admin.controller';
import { categoryAdminController } from '../controllers/admin/category.admin.controller';
import { brandAdminController } from '../controllers/admin/brand.admin.controller';
import { quotationAdminController } from '../controllers/admin/quotation.admin.controller';
import { serviceAdminController } from '../controllers/admin/service.admin.controller';
import { offerAdminController } from '../controllers/admin/offer.admin.controller';
import { analyticsAdminController } from '../controllers/admin/analytics.admin.controller';
import { publishAdminController } from '../controllers/admin/publish.admin.controller';
import { auditAdminController } from '../controllers/admin/audit.admin.controller';
import { mediaAdminController } from '../controllers/admin/media.admin.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { loginRateLimiter } from '../middleware/rate-limit.middleware';
import {
  loginSchema,
  createProductSchema,
  updateProductSchema,
  createCategorySchema,
  updateCategorySchema,
  createBrandSchema,
  updateBrandSchema,
  createOfferSchema,
  createServiceSchema,
} from '@tanmayee/validation';
import { AdminRole, UPLOAD_LIMITS } from '@tanmayee/config';

// Memory storage for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: UPLOAD_LIMITS.MAX_FILE_SIZE },
});

export const adminRouter = Router();

// ── Auth ─────────────────────────────────────────────────────────────
adminRouter.post('/auth/login', loginRateLimiter, validateBody(loginSchema), (req, res, next) =>
  adminAuthController.login(req, res, next)
);
adminRouter.get('/auth/me', authenticate, (req, res, next) =>
  adminAuthController.me(req, res, next)
);

// ── Products (Product Manager, Content Manager, Super Admin) ──────────
adminRouter.get(
  '/products',
  authenticate,
  requireRole(AdminRole.SUPER_ADMIN, AdminRole.PRODUCT_MANAGER, AdminRole.CONTENT_MANAGER, AdminRole.SALES),
  (req, res, next) => productAdminController.list(req, res, next)
);
adminRouter.get(
  '/products/:id',
  authenticate,
  requireRole(AdminRole.SUPER_ADMIN, AdminRole.PRODUCT_MANAGER, AdminRole.CONTENT_MANAGER, AdminRole.SALES),
  (req, res, next) => productAdminController.getById(req, res, next)
);
adminRouter.post(
  '/products',
  authenticate,
  requireRole(AdminRole.SUPER_ADMIN, AdminRole.PRODUCT_MANAGER, AdminRole.CONTENT_MANAGER),
  validateBody(createProductSchema),
  (req, res, next) => productAdminController.create(req, res, next)
);
adminRouter.put(
  '/products/:id',
  authenticate,
  requireRole(AdminRole.SUPER_ADMIN, AdminRole.PRODUCT_MANAGER, AdminRole.CONTENT_MANAGER),
  validateBody(updateProductSchema),
  (req, res, next) => productAdminController.update(req, res, next)
);
adminRouter.post(
  '/products/:id/publish',
  authenticate,
  requireRole(AdminRole.SUPER_ADMIN, AdminRole.PRODUCT_MANAGER),
  (req, res, next) => productAdminController.publish(req, res, next)
);
adminRouter.post(
  '/products/:id/archive',
  authenticate,
  requireRole(AdminRole.SUPER_ADMIN, AdminRole.PRODUCT_MANAGER),
  (req, res, next) => productAdminController.archive(req, res, next)
);
adminRouter.get(
  '/products/:id/versions',
  authenticate,
  requireRole(AdminRole.SUPER_ADMIN, AdminRole.PRODUCT_MANAGER, AdminRole.CONTENT_MANAGER),
  (req, res, next) => productAdminController.getVersions(req, res, next)
);
adminRouter.post(
  '/products/:id/restore/:version',
  authenticate,
  requireRole(AdminRole.SUPER_ADMIN, AdminRole.PRODUCT_MANAGER),
  (req, res, next) => productAdminController.restoreVersion(req, res, next)
);

// ── Categories ────────────────────────────────────────────────────────
adminRouter.get('/categories', authenticate, (req, res, next) =>
  categoryAdminController.list(req, res, next)
);
adminRouter.post(
  '/categories',
  authenticate,
  requireRole(AdminRole.SUPER_ADMIN, AdminRole.PRODUCT_MANAGER),
  validateBody(createCategorySchema),
  (req, res, next) => categoryAdminController.create(req, res, next)
);
adminRouter.put(
  '/categories/:id',
  authenticate,
  requireRole(AdminRole.SUPER_ADMIN, AdminRole.PRODUCT_MANAGER),
  validateBody(updateCategorySchema),
  (req, res, next) => categoryAdminController.update(req, res, next)
);

// ── Brands ────────────────────────────────────────────────────────────
adminRouter.get('/brands', authenticate, (req, res, next) =>
  brandAdminController.list(req, res, next)
);
adminRouter.post(
  '/brands',
  authenticate,
  requireRole(AdminRole.SUPER_ADMIN, AdminRole.PRODUCT_MANAGER),
  validateBody(createBrandSchema),
  (req, res, next) => brandAdminController.create(req, res, next)
);
adminRouter.put(
  '/brands/:id',
  authenticate,
  requireRole(AdminRole.SUPER_ADMIN, AdminRole.PRODUCT_MANAGER),
  validateBody(updateBrandSchema),
  (req, res, next) => brandAdminController.update(req, res, next)
);

// ── Quotations (Sales & Super Admin) ──────────────────────────────────
adminRouter.get(
  '/quotations',
  authenticate,
  requireRole(AdminRole.SUPER_ADMIN, AdminRole.SALES, AdminRole.PRODUCT_MANAGER),
  (req, res, next) => quotationAdminController.list(req, res, next)
);
adminRouter.get(
  '/quotations/:id',
  authenticate,
  requireRole(AdminRole.SUPER_ADMIN, AdminRole.SALES, AdminRole.PRODUCT_MANAGER),
  (req, res, next) => quotationAdminController.getById(req, res, next)
);
adminRouter.patch(
  '/quotations/:id/status',
  authenticate,
  requireRole(AdminRole.SUPER_ADMIN, AdminRole.SALES),
  (req, res, next) => quotationAdminController.updateStatus(req, res, next)
);

// ── Services (Service Manager & Super Admin) ──────────────────────────
adminRouter.post(
  '/services',
  authenticate,
  requireRole(AdminRole.SUPER_ADMIN, AdminRole.SERVICE_MANAGER),
  validateBody(createServiceSchema),
  (req, res, next) => serviceAdminController.createService(req, res, next)
);
adminRouter.put(
  '/services/:id',
  authenticate,
  requireRole(AdminRole.SUPER_ADMIN, AdminRole.SERVICE_MANAGER),
  (req, res, next) => serviceAdminController.updateService(req, res, next)
);
adminRouter.get(
  '/service-requests',
  authenticate,
  requireRole(AdminRole.SUPER_ADMIN, AdminRole.SERVICE_MANAGER, AdminRole.SALES),
  (req, res, next) => serviceAdminController.listRequests(req, res, next)
);
adminRouter.patch(
  '/service-requests/:id/status',
  authenticate,
  requireRole(AdminRole.SUPER_ADMIN, AdminRole.SERVICE_MANAGER, AdminRole.SALES),
  (req, res, next) => serviceAdminController.updateRequestStatus(req, res, next)
);

// ── Offers ────────────────────────────────────────────────────────────
adminRouter.get('/offers', authenticate, (req, res, next) =>
  offerAdminController.list(req, res, next)
);
adminRouter.post(
  '/offers',
  authenticate,
  requireRole(AdminRole.SUPER_ADMIN, AdminRole.PRODUCT_MANAGER),
  validateBody(createOfferSchema),
  (req, res, next) => offerAdminController.create(req, res, next)
);
adminRouter.put(
  '/offers/:id',
  authenticate,
  requireRole(AdminRole.SUPER_ADMIN, AdminRole.PRODUCT_MANAGER),
  (req, res, next) => offerAdminController.update(req, res, next)
);

// ── Analytics & CRM ───────────────────────────────────────────────────
adminRouter.get(
  '/analytics/dashboard',
  authenticate,
  requireRole(AdminRole.SUPER_ADMIN, AdminRole.SALES, AdminRole.PRODUCT_MANAGER),
  (req, res, next) => analyticsAdminController.getDashboard(req, res, next)
);
adminRouter.get(
  '/analytics/leads',
  authenticate,
  requireRole(AdminRole.SUPER_ADMIN, AdminRole.SALES),
  (req, res, next) => analyticsAdminController.listLeads(req, res, next)
);

// ── Publishing Engine ─────────────────────────────────────────────────
adminRouter.post(
  '/publish',
  authenticate,
  requireRole(AdminRole.SUPER_ADMIN, AdminRole.PRODUCT_MANAGER),
  (req, res, next) => publishAdminController.refresh(req, res, next)
);

// ── Media Library ─────────────────────────────────────────────────────
adminRouter.post(
  '/media/upload',
  authenticate,
  upload.single('file'),
  (req, res, next) => mediaAdminController.upload(req, res, next)
);

// ── Audit Logs ────────────────────────────────────────────────────────
adminRouter.get(
  '/audit-logs',
  authenticate,
  requireRole(AdminRole.SUPER_ADMIN),
  (req, res, next) => auditAdminController.list(req, res, next)
);
