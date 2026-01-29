import mongoose, { Document, Schema } from 'mongoose';

// Country interface
export interface ICountry {
  name: string;
  isoCode: string;
  countryCode: string;
  language: string;
}

// Vendor Filter interface
export interface IVendorFilter {
  vendorId: string;
  vendorName: string;
  vendorCurrency: string[];
  redirects: {
    completeRedirect?: string;
    terminateRedirect?: string;
    quotaFullRedirect?: string;
    securityRedirect?: string;
  };
}

// Client Filter interface
export interface IClientFilter {
  clientId: string;
  clientName: string;
  clientCurrency: string[];
}

// Filter document interface
export interface IFilter extends Document {
  countries: ICountry[];
  vendors: IVendorFilter[];
  gender: string[];
  clients: IClientFilter[];
  status: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Filter Schema
const FilterSchema = new Schema<IFilter>(
  {
    countries: [
      {
        name: {
          type: String,
          required: true,
        },
        isoCode: {
          type: String,
          required: true,
        },
        countryCode: {
          type: String,
          required: true,
        },
        language: {
          type: String,
          required: false,
        },
      },
    ],
    vendors: [
      {
        vendorId: {
          type: String,
          required: true,
        },
        vendorName: {
          type: String,
          required: true,
        },
        vendorCurrency: [
          {
            type: String,
          },
        ],
        redirects: {
          completeRedirect: String,
          terminateRedirect: String,
          quotaFullRedirect: String,
          securityRedirect: String,
        },
      },
    ],
    gender: [
      {
        type: String,
        enum: ['MALE', 'FEMALE', 'OTHER'],
      },
    ],
    clients: [
      {
        clientId: {
          type: String,
          required: true,
        },
        clientName: {
          type: String,
          required: true,
        },
        clientCurrency: [
          {
            type: String,
          },
        ],
      },
    ],
    status: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// JSON transformation
FilterSchema.set('toJSON', {
  transform: (_doc, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Filter = mongoose.model<IFilter>('Filter', FilterSchema);
export default Filter;
