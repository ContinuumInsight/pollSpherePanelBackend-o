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

// Create client schema
export const createClientSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Client name is required').trim(),
    email: z.string().email('Invalid email address').toLowerCase().trim(),
    phone: z.string().min(1, 'Phone number is required').trim(),
    companyInfo: companyInfoSchema,
    address: addressSchema.optional(),
    status: z.enum(['active', 'inactive', 'suspended']).optional(),
  }),
});

// Update client schema
export const updateClientSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Client ID is required'),
  }),
  body: z.object({
    name: z.string().min(1, 'Client name is required').trim().optional(),
    email: z.string().email('Invalid email address').toLowerCase().trim().optional(),
    phone: z.string().min(1, 'Phone number is required').trim().optional(),
    companyInfo: companyInfoSchema.partial().optional(),
    address: addressSchema.optional(),
    status: z.enum(['active', 'inactive', 'suspended']).optional(),
  }),
});

// List clients schema
export const listClientsSchema = z.object({
  body: z.object({
    page: z.number().int().positive().optional().default(1),
    limit: z.number().int().positive().max(100).optional().default(10),
    search: z.string().trim().optional(),
    status: z.enum(['active', 'inactive', 'suspended']).optional(),
    sortBy: z
      .enum(['name', 'email', 'status', 'createdAt', 'updatedAt'])
      .optional()
      .default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  }),
});

// Get client by ID schema
export const getClientByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Client ID is required'),
  }),
});

// Delete client schema
export const deleteClientSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Client ID is required'),
  }),
});

export type CreateClientInput = z.infer<typeof createClientSchema>['body'];
export type UpdateClientInput = z.infer<typeof updateClientSchema>['body'];
export type ListClientsInput = z.infer<typeof listClientsSchema>['body'];
export type GetClientByIdInput = z.infer<typeof getClientByIdSchema>['params'];
export type DeleteClientInput = z.infer<typeof deleteClientSchema>['params'];
