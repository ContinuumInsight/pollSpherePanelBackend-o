import { z } from 'zod';

// Common schemas
const companyInfoSchema = z.object({
  companyName: z.string().min(1, 'Company name is required').trim(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  taxId: z.string().trim().optional(),
  panNumber: z.string().trim().optional(),
  msme: z.string().trim().optional(),
  cinNumber: z.string().trim().optional(),
});

const addressSchema = z.object({
  country: z.string().trim().optional(),
  stateProvince: z.string().trim().optional(),
  city: z.string().trim().optional(),
  zipCode: z.string().trim().optional(),
  completeAddress: z.string().trim().optional(),
});

const redirectsSchema = z.object({
  completeRedirect: z.string().url('Invalid URL').optional().or(z.literal('')),
  terminateRedirect: z.string().url('Invalid URL').optional().or(z.literal('')),
  quotaFullRedirect: z.string().url('Invalid URL').optional().or(z.literal('')),
  securityRedirect: z.string().url('Invalid URL').optional().or(z.literal('')),
});

const bankDetailsSchema = z.object({
  bankName: z.string().trim().optional(),
  accountType: z.string().trim().optional(),
  accountNumber: z.string().trim().optional(),
  accountHolderName: z.string().trim().optional(),
  ifscCode: z.string().trim().optional(),
  micrCode: z.string().trim().optional(),
  bankAddress: z.string().trim().optional(),
  swiftCode: z.string().trim().optional(),
  currency: z.array(z.string().trim()).optional(),
  intermediaryAccountNo: z.string().trim().optional(),
  intermediarySwiftCode: z.string().trim().optional(),
});

// Create vendor schema
export const createVendorSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Vendor name is required').trim(),
    email: z.string().email('Invalid email address').toLowerCase().trim(),
    phone: z.string().min(1, 'Phone number is required').trim(),
    tier: z.enum(['tier_1', 'tier_2', 'tier_3'], {
      errorMap: () => ({ message: 'Invalid tier value' }),
    }),
    currency: z
      .array(z.string().trim())
      .min(1, 'At least one currency is required'),
    companyInfo: companyInfoSchema,
    address: addressSchema.optional(),
    redirects: redirectsSchema.optional(),
    bankDetails: bankDetailsSchema.optional(),
    status: z.enum(['active', 'inactive', 'suspended']).optional(),
  }),
});

// Update vendor schema
export const updateVendorSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Vendor ID is required'),
  }),
  body: z.object({
    name: z.string().min(1, 'Vendor name is required').trim().optional(),
    email: z.string().email('Invalid email address').toLowerCase().trim().optional(),
    phone: z.string().min(1, 'Phone number is required').trim().optional(),
    tier: z.enum(['tier_1', 'tier_2', 'tier_3']).optional(),
    currency: z.array(z.string().trim()).min(1).optional(),
    companyInfo: companyInfoSchema.partial().optional(),
    address: addressSchema.optional(),
    redirects: redirectsSchema.optional(),
    bankDetails: bankDetailsSchema.optional(),
    status: z.enum(['active', 'inactive', 'suspended']).optional(),
  }),
});

// List vendors schema
export const listVendorsSchema = z.object({
  body: z.object({
    page: z.number().int().positive().optional().default(1),
    limit: z.number().int().positive().max(100).optional().default(10),
    search: z.string().trim().optional(),
    status: z.enum(['active', 'inactive', 'suspended']).optional(),
    tier: z.enum(['tier_1', 'tier_2', 'tier_3']).optional(),
    sortBy: z
      .enum(['name', 'email', 'tier', 'status', 'createdAt', 'updatedAt'])
      .optional()
      .default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  }),
});

// Get vendor by ID schema
export const getVendorByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Vendor ID is required'),
  }),
});

// Delete vendor schema
export const deleteVendorSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Vendor ID is required'),
  }),
});

export type CreateVendorInput = z.infer<typeof createVendorSchema>['body'];
export type UpdateVendorInput = z.infer<typeof updateVendorSchema>['body'];
export type ListVendorsInput = z.infer<typeof listVendorsSchema>['body'];
export type GetVendorByIdInput = z.infer<typeof getVendorByIdSchema>['params'];
export type DeleteVendorInput = z.infer<typeof deleteVendorSchema>['params'];
