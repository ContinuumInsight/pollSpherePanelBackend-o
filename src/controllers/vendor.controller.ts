import { Request, Response } from 'express';
import * as vendorService from '../services/vendor.service';
import { sendSuccess } from '../common/response';
import {
  CreateVendorInput,
  ListVendorsInput,
} from '../schemas/vendor.schema';
import { AuthRequest } from '../common/types';

// Create vendor
export const createVendor = async (
  req: Request<{}, {}, CreateVendorInput>,
  res: Response
): Promise<void> => {
  const authReq = req as AuthRequest;
  const adminEmail = authReq.user!.email;

  const vendor = await vendorService.createVendor(req.body, adminEmail);

  sendSuccess(res, vendor, 'Vendor created successfully', 201);
};

// List vendors
export const listVendors = async (
  req: Request<{}, {}, ListVendorsInput>,
  res: Response
): Promise<void> => {
  const result = await vendorService.listVendors(req.body);

  sendSuccess(res, result, 'Vendors retrieved successfully');
};

// Get vendor by ID
export const getVendorById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const vendor = await vendorService.getVendorById(req.params.id);

  sendSuccess(res, vendor, 'Vendor retrieved successfully');
};

// Update vendor
export const updateVendor = async (
  req: Request,
  res: Response
): Promise<void> => {
  const authReq = req as AuthRequest;
  const adminEmail = authReq.user!.email;

  const vendor = await vendorService.updateVendor(
    req.params.id,
    req.body,
    adminEmail
  );

  sendSuccess(res, vendor, 'Vendor updated successfully');
};

// Delete vendor
export const deleteVendor = async (
  req: Request,
  res: Response
): Promise<void> => {
  const authReq = req as AuthRequest;
  const adminEmail = authReq.user!.email;

  await vendorService.deleteVendor(req.params.id, adminEmail);

  sendSuccess(res, null, 'Vendor deleted successfully');
};

export default {
  createVendor,
  listVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
};
