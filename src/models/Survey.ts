import mongoose, { Document, Schema } from 'mongoose';
import { SURVEY_STATUS, type SurveyStatus } from '../common/constants/surveyStatus';

// Vendor interface
export interface IVendorSurvey {
  vendorId: string;
  vendorName: string;
  allocation: number;
  vendorCpi?: number;
  vendorCurrency?: string;
  quota: boolean;
  redirects: {
    completeRedirect?: string;
    quotaFullRedirect?: string;
    terminateRedirect?: string;
    securityRedirect?: string;
  };
  startUrl?: string;
  isActive: boolean;
}

// Country interface
export interface ICountrySurvey {
  country: string;
  targetCompletes?: number;
  liveUrl?: string;
  testUrl?: string;
  vendors: IVendorSurvey[];
}

// Basic details interface
export interface IBasicDetails {
  name: string;
  psCode: number;
  linkType: 'single' | 'multiple';
  loi: number;
  ir: number;
  device: 'mobile' | 'desktop' | 'both';
  launchType: 'soft-launch' | 'full-launch';
  reconnectStudy: 'yes' | 'no';
  isInternalPanel: boolean;
  startDate?: Date;
  endDate?: Date;
}

// Client details interface
export interface IClientDetails {
  clientId: string;
  clientName?: string;
  cpi?: number;
  currency?: string;
  totalCompletes?: number;
}

// Survey interface
export interface ISurvey extends Document {
  surveyId: string;
  basic: IBasicDetails;
  client: IClientDetails;
  countries: ICountrySurvey[];
  status: SurveyStatus;
  totalCompletes: number;
  createdBy: string;
  updatedBy?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Vendor Schema
const VendorSurveySchema = new Schema<IVendorSurvey>(
  {
    vendorId: {
      type: String,
      required: true,
    },
    vendorName: {
      type: String,
      required: true,
    },
    allocation: {
      type: Number,
      required: true,
    },
    vendorCpi: Number,
    vendorCurrency: String,
    quota: {
      type: Boolean,
      default: false,
    },
    redirects: {
      completeRedirect: String,
      quotaFullRedirect: String,
      terminateRedirect: String,
      securityRedirect: String,
    },
    startUrl: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

// Country Schema
const CountrySurveySchema = new Schema<ICountrySurvey>(
  {
    country: {
      type: String,
      required: true,
    },
    targetCompletes: Number,
    liveUrl: String,
    testUrl: String,
    vendors: [VendorSurveySchema],
  },
  { _id: false }
);

// Basic Details Schema
const BasicDetailsSchema = new Schema<IBasicDetails>(
  {
    name: {
      type: String,
      required: true,
    },
    psCode: {
      type: Number,
      required: true,
      unique: true,
    },
    linkType: {
      type: String,
      enum: ['single', 'multiple'],
      default: 'single',
    },
    loi: {
      type: Number,
      required: true,
    },
    ir: {
      type: Number,
      required: true,
    },
    device: {
      type: String,
      enum: ['mobile', 'desktop', 'both'],
      default: 'both',
    },
    launchType: {
      type: String,
      enum: ['soft-launch', 'full-launch'],
      default: 'full-launch',
    },
    reconnectStudy: {
      type: String,
      enum: ['yes', 'no'],
      default: 'no',
    },
    isInternalPanel: {
      type: Boolean,
      default: false,
    },
    startDate: Date,
    endDate: Date,
  },
  { _id: false }
);

// Client Details Schema
const ClientDetailsSchema = new Schema<IClientDetails>(
  {
    clientId: {
      type: String,
      required: true,
    },
    clientName: String,
    cpi: Number,
    currency: String,
    totalCompletes: Number,
  },
  { _id: false }
);

// Main Survey Schema
const SurveySchema = new Schema<ISurvey>(
  {
    surveyId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    basic: {
      type: BasicDetailsSchema,
      required: true,
    },
    client: {
      type: ClientDetailsSchema,
      required: true,
    },
    countries: [CountrySurveySchema],
    status: {
      type: String,
      enum: SURVEY_STATUS,
      default: 'LP',
      index: true,
    },
    totalCompletes: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: String,
      required: true,
    },
    updatedBy: String,
    notes: String,
  },
  {
    timestamps: true,
  }
);

// JSON transformation
SurveySchema.set('toJSON', {
  transform: (_doc, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Survey = mongoose.model<ISurvey>('Survey', SurveySchema);
export default Survey;
