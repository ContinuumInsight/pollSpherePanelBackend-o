import { z } from 'zod';

export const emailValidator = z.string().email('Invalid email address');

export const passwordValidator = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character');

export const idValidator = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format');

export const paginationValidator = z.object({
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().max(100).optional().default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export default {
  emailValidator,
  passwordValidator,
  idValidator,
  paginationValidator,
};
