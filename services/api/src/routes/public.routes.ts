// ============================================================================
// @tanmayee/api — Public API Routes
// ============================================================================

import { Router } from 'express';
import { productController } from '../controllers/product.controller';
import { categoryController } from '../controllers/category.controller';
import { brandController } from '../controllers/brand.controller';
import { searchController } from '../controllers/search.controller';
import { filterController } from '../controllers/filter.controller';
import { cartController } from '../controllers/cart.controller';
import { quotationController } from '../controllers/quotation.controller';
import { serviceController } from '../controllers/service.controller';
import { analyticsController } from '../controllers/analytics.controller';
import { recommendationController } from '../controllers/recommendation.controller';
import { validateBody } from '../middleware/validation.middleware';
import {
  addToCartSchema,
  updateCartItemSchema,
  submitQuotationSchema,
  serviceRequestSchema,
  trackEventSchema,
} from '@tanmayee/validation';

export const publicRouter = Router();

// Products
publicRouter.get('/products', (req, res, next) => productController.list(req, res, next));
publicRouter.get('/products/:slug', (req, res, next) => productController.getBySlug(req, res, next));
publicRouter.get('/products/:id/similar', (req, res, next) => productController.getSimilar(req, res, next));

// Categories & Brands
publicRouter.get('/categories', (req, res, next) => categoryController.listTree(req, res, next));
publicRouter.get('/categories/:slug', (req, res, next) => categoryController.getBySlug(req, res, next));
publicRouter.get('/brands', (req, res, next) => brandController.list(req, res, next));
publicRouter.get('/brands/:slug', (req, res, next) => brandController.getBySlug(req, res, next));

// Search & Dynamic Filters
publicRouter.get('/search', (req, res, next) => searchController.query(req, res, next));
publicRouter.get('/search/suggestions', (req, res, next) => searchController.suggestions(req, res, next));
publicRouter.get('/filters/:categorySlug', (req, res, next) => filterController.getFiltersForCategory(req, res, next));

// Cart
publicRouter.get('/cart', (req, res, next) => cartController.get(req, res, next));
publicRouter.post('/cart', validateBody(addToCartSchema), (req, res, next) => cartController.addItem(req, res, next));
publicRouter.patch('/cart/items/:id', validateBody(updateCartItemSchema), (req, res, next) => cartController.updateItem(req, res, next));
publicRouter.delete('/cart/items/:id', (req, res, next) => cartController.removeItem(req, res, next));

// Quotations
publicRouter.post('/quotations', (req, res, next) => quotationController.generate(req, res, next));
publicRouter.get('/quotations/:id', (req, res, next) => quotationController.getById(req, res, next));
publicRouter.post('/quotations/:id/submit', validateBody(submitQuotationSchema.omit({ quotation_id: true })), (req, res, next) => quotationController.submit(req, res, next));

// Services
publicRouter.get('/services', (req, res, next) => serviceController.list(req, res, next));
publicRouter.get('/services/:slug', (req, res, next) => serviceController.getBySlug(req, res, next));
publicRouter.post('/service-requests', validateBody(serviceRequestSchema), (req, res, next) => serviceController.createRequest(req, res, next));

// Analytics & Recommendations
publicRouter.post('/events', validateBody(trackEventSchema), (req, res, next) => analyticsController.trackEvent(req, res, next));
publicRouter.post('/events/batch', (req, res, next) => analyticsController.trackBatch(req, res, next));
publicRouter.get('/recommendations', (req, res, next) => recommendationController.getPersonalized(req, res, next));
