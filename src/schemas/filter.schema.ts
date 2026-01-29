import { z } from 'zod';

// Country schema
const countrySchema = z.object({
  name: z.string().min(1, 'Country name is required'),
  isoCode: z.string().min(2, 'ISO code is required').max(3),
  countryCode: z.string().min(1, 'Country code is required'),
  language: z.string().min(1, 'Language is required'),
});

// Add or update countries schema
export const addOrUpdateCountriesSchema = z.object({
  body: z.object({
    countries: z.array(countrySchema).min(1, 'At least one country is required'),
  }),
});

// Remove item schema
export const removeItemSchema = z.object({
  query: z.object({
    type: z.enum(['country', 'vendor', 'client'], {
      errorMap: () => ({ message: 'Type must be country, vendor, or client' }),
    }),
    id: z.string().min(1, 'ID is required'),
  }),
});

export type AddOrUpdateCountriesInput = z.infer<typeof addOrUpdateCountriesSchema>['body'];
export type RemoveItemInput = z.infer<typeof removeItemSchema>['query'];
