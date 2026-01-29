import type {
  SurveyCallbackStatus,
  SurveyResponseStatus,
  SurveyStatus,
} from '../common/constants/surveyStatus';

// Basic details DTO
export interface BasicDetailsDTO {
  name: string;
  psCode?: number;
  linkType?: 'single' | 'multiple';
  loi: number;
  ir: number;
  device?: 'mobile' | 'desktop' | 'both';
  launchType?: 'soft-launch' | 'full-launch';
  reconnectStudy?: 'yes' | 'no';
  isInternalPanel?: boolean;
  startDate?: string;
  endDate?: string;
}

// Client details DTO
export interface ClientDetailsDTO {
  clientId: string;
  clientName?: string;
  cpi?: number;
  currency?: string;
  totalCompletes?: number;
}

// Vendor survey DTO
export interface VendorSurveyDTO {
  vendorId: string;
  vendorName: string;
  allocation: number;
  vendorCpi?: number;
  vendorCurrency?: string;
  quota?: boolean;
  redirects?: {
    completeRedirect?: string;
    quotaFullRedirect?: string;
    terminateRedirect?: string;
    securityRedirect?: string;
  };
  startUrl?: string;
  isActive?: boolean;
}

// Country survey DTO
export interface CountrySurveyDTO {
  country: string;
  targetCompletes?: number;
  liveUrl?: string;
  testUrl?: string;
  vendors: VendorSurveyDTO[];
}

// Create survey DTO
export interface CreateSurveyDTO {
  basic: BasicDetailsDTO;
  client: ClientDetailsDTO;
  countries: CountrySurveyDTO[];
  status?: SurveyStatus;
  notes?: string;
}

// Update survey DTO
export interface UpdateSurveyDTO {
  basic?: Partial<BasicDetailsDTO>;
  client?: Partial<ClientDetailsDTO>;
  countries?: CountrySurveyDTO[];
  status?: SurveyStatus;
  notes?: string;
}

// List surveys DTO
export interface ListSurveysDTO {
  page?: number;
  limit?: number;
  status?: string;
  clientId?: string;
  search?: string;
}

// Change status DTO
export interface ChangeStatusDTO {
  status: SurveyStatus;
}

// Survey callback DTO
export interface SurveyCallbackDTO {
  status: SurveyCallbackStatus;
  uid: string;
}

// Survey response DTO
export interface SurveyResponseDTO {
  id: string;
  surveyId: string;
  psCode: number;
  uid: string;
  vendorId: string;
  vendorName: string;
  country: string;
  status: SurveyResponseStatus;
  ipAddress?: string;
  userAgent?: string;
  startedAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
