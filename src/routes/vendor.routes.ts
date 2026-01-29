import { Router } from 'express';
import * as vendorController from '../controllers/vendor.controller';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { asyncHandler } from '../middleware/asyncHandler';
import { validateRequest } from '../middleware/validateRequest';
import {
  createVendorSchema,
  listVendorsSchema,
  getVendorByIdSchema,
  updateVendorSchema,
  deleteVendorSchema,
} from '../schemas/vendor.schema';

const router = Router();

// All vendor routes require authentication and super_admin or finance_manager role
const vendorAuthorization = [authenticate, authorize('super_admin', 'finance_manager')];

// Create vendor
router.post(
  '/create',
  vendorAuthorization,
  validateRequest(createVendorSchema),
  asyncHandler(vendorController.createVendor)
);

// List vendors with filters
router.post(
  '/listVendors',
  vendorAuthorization,
  validateRequest(listVendorsSchema),
  asyncHandler(vendorController.listVendors)
);

// Get vendor by ID
router.get(
  '/:id',
  vendorAuthorization,
  validateRequest(getVendorByIdSchema),
  asyncHandler(vendorController.getVendorById)
);

// Update vendor
router.put(
  '/update/:id',
  vendorAuthorization,
  validateRequest(updateVendorSchema),
  asyncHandler(vendorController.updateVendor)
);

// Delete vendor
router.delete(
  '/delete/:id',
  vendorAuthorization,
  validateRequest(deleteVendorSchema),
  asyncHandler(vendorController.deleteVendor)
);

export default router;
