import * as vendorRepository from '../repositories/vendor.repository';
import {
  CreateVendorDTO,
  UpdateVendorDTO,
  VendorResponseDTO,
  ListVendorsQueryDTO,
  ListVendorsResponseDTO,
} from '../dtos/vendor.dto';
import { ConflictError, NotFoundError } from '../common/errors';
import { IVendor } from '../models/Vendor';
import logger from '../common/utils/logger';
import * as filterService from './filter.service';

// Format vendor response
const formatVendorResponse = (vendor: IVendor): VendorResponseDTO => {
  return {
    id: vendor._id.toString(),
    name: vendor.name,
    email: vendor.email,
    phone: vendor.phone,
    tier: vendor.tier,
    currency: vendor.currency,
    companyInfo: vendor.companyInfo,
    address: vendor.address,
    redirects: vendor.redirects,
    bankDetails: vendor.bankDetails,
    status: vendor.status,
    createdBy: vendor.createdBy,
    updatedBy: vendor.updatedBy,
    createdAt: vendor.createdAt,
    updatedAt: vendor.updatedAt,
  };
};

// Create vendor
export const createVendor = async (
  vendorData: CreateVendorDTO,
  adminEmail: string
): Promise<VendorResponseDTO> => {
  // Check if vendor with email already exists
  const existingVendor = await vendorRepository.findByEmail(vendorData.email);
  if (existingVendor) {
    throw new ConflictError('Vendor with this email already exists');
  }

  // Create vendor with admin email
  const vendor = await vendorRepository.create({
    ...vendorData,
    createdBy: adminEmail,
    updatedBy: adminEmail,
  });

  logger.info(`Vendor created: ${vendor.email} by ${adminEmail}`);

  // Sync vendor to filters
  await filterService.syncVendor({
    vendorId: vendor._id.toString(),
    vendorName: vendor.name,
    vendorCurrency: vendor.currency,
    redirects: {
      completeRedirect: vendor.redirects?.completeRedirect,
      terminateRedirect: vendor.redirects?.terminateRedirect,
      quotaFullRedirect: vendor.redirects?.quotaFullRedirect,
      securityRedirect: vendor.redirects?.securityRedirect,
    },
  });

  return formatVendorResponse(vendor);
};

// Get vendor by ID
export const getVendorById = async (id: string): Promise<VendorResponseDTO> => {
  const vendor = await vendorRepository.findById(id);

  if (!vendor) {
    throw new NotFoundError('Vendor not found');
  }

  return formatVendorResponse(vendor);
};

// Update vendor
export const updateVendor = async (
  id: string,
  updateData: UpdateVendorDTO,
  adminEmail: string
): Promise<VendorResponseDTO> => {
  // Check if vendor exists
  const existingVendor = await vendorRepository.findById(id);
  if (!existingVendor) {
    throw new NotFoundError('Vendor not found');
  }

  // If email is being updated, check if new email is already in use
  if (updateData.email && updateData.email !== existingVendor.email) {
    const emailExists = await vendorRepository.existsByEmail(updateData.email);
    if (emailExists) {
      throw new ConflictError('Vendor with this email already exists');
    }
  }

  // Build update object with proper nested field handling
  const updateObject: any = {
    updatedBy: adminEmail,
  };

  // Update top-level fields
  if (updateData.name !== undefined) updateObject.name = updateData.name;
  if (updateData.email !== undefined) updateObject.email = updateData.email;
  if (updateData.phone !== undefined) updateObject.phone = updateData.phone;
  if (updateData.tier !== undefined) updateObject.tier = updateData.tier;
  if (updateData.currency !== undefined) updateObject.currency = updateData.currency;
  if (updateData.status !== undefined) updateObject.status = updateData.status;

  // Update nested fields - merge with existing data
  if (updateData.companyInfo) {
    updateObject.companyInfo = {
      ...existingVendor.companyInfo,
      ...updateData.companyInfo,
    };
  }

  if (updateData.address) {
    updateObject.address = {
      ...existingVendor.address,
      ...updateData.address,
    };
  }

  if (updateData.redirects) {
    updateObject.redirects = {
      ...existingVendor.redirects,
      ...updateData.redirects,
    };
  }

  if (updateData.bankDetails) {
    updateObject.bankDetails = {
      ...existingVendor.bankDetails,
      ...updateData.bankDetails,
    };
  }

  // Update vendor
  const updatedVendor = await vendorRepository.updateById(id, updateObject);

  if (!updatedVendor) {
    throw new NotFoundError('Vendor not found after update');
  }

  logger.info(`Vendor updated: ${updatedVendor.email} by ${adminEmail}`);

  // Sync updated vendor to filters
  await filterService.syncVendor({
    vendorId: updatedVendor._id.toString(),
    vendorName: updatedVendor.name,
    vendorCurrency: updatedVendor.currency,
    redirects: {
      completeRedirect: updatedVendor.redirects?.completeRedirect,
      terminateRedirect: updatedVendor.redirects?.terminateRedirect,
      quotaFullRedirect: updatedVendor.redirects?.quotaFullRedirect,
      securityRedirect: updatedVendor.redirects?.securityRedirect,
    },
  });

  return formatVendorResponse(updatedVendor);
};

// Delete vendor
export const deleteVendor = async (
  id: string,
  adminEmail: string
): Promise<void> => {
  const vendor = await vendorRepository.findById(id);

  if (!vendor) {
    throw new NotFoundError('Vendor not found');
  }

  await vendorRepository.deleteById(id);

  logger.info(`Vendor deleted: ${vendor.email} by ${adminEmail}`);

  // Remove vendor from filters
  await filterService.removeVendorFromFilters(id);
};

// List vendors with filters
export const listVendors = async (
  query: ListVendorsQueryDTO
): Promise<ListVendorsResponseDTO> => {
  const result = await vendorRepository.listVendors(query);

  return {
    vendors: result.vendors.map(formatVendorResponse),
    pagination: {
    total: result.total,
    page: result.page,
    limit: result.limit,
    totalPages: result.totalPages
    }
  };
};

export default {
  createVendor,
  getVendorById,
  updateVendor,
  deleteVendor,
  listVendors,
};
