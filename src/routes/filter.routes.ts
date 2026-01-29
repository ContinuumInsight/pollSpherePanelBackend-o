import { Router } from 'express';
import * as filterController from '../controllers/filter.controller';
import { authenticate } from '../middleware/authenticate';
import { asyncHandler } from '../middleware/asyncHandler';
import { validateRequest } from '../middleware/validateRequest';
import {
  addOrUpdateCountriesSchema,
  removeItemSchema,
} from '../schemas/filter.schema';

const router = Router();

// All filter routes require authentication (accessible by all authenticated users)

// Get all filters
router.get(
  '/all',
  authenticate,
  asyncHandler(filterController.getAllFilters)
);

// Add or update countries
router.post(
  '/addOrUpdate',
  authenticate,
  validateRequest(addOrUpdateCountriesSchema),
  asyncHandler(filterController.addOrUpdateCountries)
);

// Remove item from filters (country, vendor, or client)
router.delete(
  '/remove',
  authenticate,
  validateRequest(removeItemSchema),
  asyncHandler(filterController.removeItem)
);

export default router;
