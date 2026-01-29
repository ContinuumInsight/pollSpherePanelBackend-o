import { z } from 'zod';
import { SURVEY_CALLBACK_STATUS, SURVEY_STATUS } from '../common/constants/surveyStatus';

// Vendor survey schema
const vendorSurveySchema = z.object({
  vendorId: z.string().min(1, 'Vendor ID is required'),
  vendorName: z.string().min(1, 'Vendor name is required'),
  allocation: z.number().min(0, 'Allocation must be a positive number'),
  vendorCpi: z.number().optional(),
  vendorCurrency: z.string().optional(),
  quota: z.boolean().optional(),
  redirects: z
    .object({
      completeRedirect: z.string().optional(),
      quotaFullRedirect: z.string().optional(),
      terminateRedirect: z.string().optional(),
      securityRedirect: z.string().optional(),
    })
    .optional(),
  isActive: z.boolean().optional(),
});

// Country survey schema
const countrySurveySchema = z.object({
  country: z
    .string()
    .regex(/^[A-Z]{2}$/, 'Country must be an ISO2 code (e.g. IN, US)'),
  targetCompletes: z.number().optional(),
  liveUrl: z.string().optional(),
  testUrl: z.string().optional(),
  vendors: z.array(vendorSurveySchema).min(1, 'At least one vendor is required'),
});

// Basic details schema
const basicDetailsSchema = z.object({
  name: z.string().min(1, 'Survey name is required'),
  linkType: z.enum(['single', 'multiple']).optional(),
  loi: z.number().min(0, 'LOI must be a positive number'),
  ir: z.number().min(0, 'IR must be a positive number'),
  device: z.enum(['mobile', 'desktop', 'both']).optional(),
  launchType: z.enum(['soft-launch', 'full-launch']).optional(),
  reconnectStudy: z.enum(['yes', 'no']).optional(),
  isInternalPanel: z.boolean().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// Client details schema
const clientDetailsSchema = z.object({
  clientId: z.string().min(1, 'Client ID is required'),
  clientName: z.string().optional(),
  cpi: z.number().optional(),
  currency: z.string().optional(),
  totalCompletes: z.number().optional(),
});

// Create survey schema
export const createSurveySchema = z.object({
  body: z.object({
    basic: basicDetailsSchema,
    client: clientDetailsSchema,
    countries: z.array(countrySurveySchema).min(1, 'At least one country is required'),
    status: z.enum(SURVEY_STATUS).optional(),
    notes: z.string().optional(),
  }),
});

// Update survey schema (all fields optional)
export const updateSurveySchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Survey ID is required'),
  }),
  body: z.object({
    basic: basicDetailsSchema.partial().optional(),
    client: clientDetailsSchema.partial().optional(),
    countries: z.array(countrySurveySchema).optional(),
    status: z.enum(SURVEY_STATUS).optional(),
    notes: z.string().optional(),
  }),
});

// List surveys schema
export const listSurveysSchema = z.object({
  body: z.object({
    page: z.number().optional(),
    limit: z.number().optional(),
    status: z.string().optional(),
    clientId: z.string().optional(),
    search: z.string().optional(),
  }),
});

// Change status schema
export const changeStatusSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Survey ID is required'),
  }),
  body: z.object({
    status: z.enum(SURVEY_STATUS),
  }),
});

// Survey callback schema (for client completion redirect)
export const surveyCallbackSchema = z.object({
  status: z.enum(SURVEY_CALLBACK_STATUS),
  uid: z.string().min(1, 'UID is required'),
});

// Types
export type CreateSurveyInput = z.infer<typeof createSurveySchema>['body'];
export type UpdateSurveyInput = z.infer<typeof updateSurveySchema>['body'];
export type ListSurveysInput = z.infer<typeof listSurveysSchema>['body'];
export type ChangeStatusInput = z.infer<typeof changeStatusSchema>['body'];
export type SurveyCallbackInput = z.infer<typeof surveyCallbackSchema>;
