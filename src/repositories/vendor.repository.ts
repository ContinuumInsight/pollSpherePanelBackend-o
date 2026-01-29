import Vendor, { IVendor } from '../models/Vendor';
import { FilterQuery, UpdateQuery } from 'mongoose';

interface ListVendorsOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  tier?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface ListVendorsResult {
  vendors: IVendor[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const create = async (vendorData: Partial<IVendor>): Promise<IVendor> => {
  const vendor = new Vendor(vendorData);
  return await vendor.save();
};

export const findById = async (id: string): Promise<IVendor | null> => {
  return await Vendor.findById(id);
};

export const findByEmail = async (email: string): Promise<IVendor | null> => {
  return await Vendor.findOne({ email: email.toLowerCase() });
};

export const existsByEmail = async (email: string): Promise<boolean> => {
  const count = await Vendor.countDocuments({ email: email.toLowerCase() });
  return count > 0;
};

export const updateById = async (
  id: string,
  updateData: UpdateQuery<IVendor>
): Promise<IVendor | null> => {
  return await Vendor.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

export const deleteById = async (id: string): Promise<IVendor | null> => {
  return await Vendor.findByIdAndDelete(id);
};

export const listVendors = async (
  options: ListVendorsOptions
): Promise<ListVendorsResult> => {
  const {
    page = 1,
    limit = 10,
    search,
    status,
    tier,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = options;

  const skip = (page - 1) * limit;

  // Build filter query
  const filter: FilterQuery<IVendor> = {};

  // Search filter
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { 'companyInfo.companyName': { $regex: search, $options: 'i' } },
    ];
  }

  // Status filter
  if (status) {
    filter.status = status;
  }

  // Tier filter
  if (tier) {
    filter.tier = tier;
  }

  // Sort options
  const sortOptions: any = {};
  sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

  // Execute query
  const [vendors, total] = await Promise.all([
    Vendor.find(filter).sort(sortOptions).skip(skip).limit(limit),
    Vendor.countDocuments(filter),
  ]);

  return {
    vendors,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const findAll = async (): Promise<IVendor[]> => {
  return await Vendor.find();
};

export const countByStatus = async (status: string): Promise<number> => {
  return await Vendor.countDocuments({ status });
};

export default {
  create,
  findById,
  findByEmail,
  existsByEmail,
  updateById,
  deleteById,
  listVendors,
  findAll,
  countByStatus,
};
