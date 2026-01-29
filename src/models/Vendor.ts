import mongoose, { Document, Schema } from 'mongoose';

// Vendor interface
export interface IVendor extends Document {
  name: string;
  email: string;
  phone: string;
  tier: string;
  currency: string[];
  companyInfo: {
    companyName: string;
    website?: string;
    taxId?: string;
    panNumber?: string;
    msme?: string;
    cinNumber?: string;
  };
  address: {
    country?: string;
    stateProvince?: string;
    city?: string;
    zipCode?: string;
    completeAddress?: string;
  };
  redirects: {
    completeRedirect?: string;
    terminateRedirect?: string;
    quotaFullRedirect?: string;
    securityRedirect?: string;
  };
  bankDetails?: {
    bankName?: string;
    accountType?: string;
    accountNumber?: string;
    accountHolderName?: string;
    ifscCode?: string;
    micrCode?: string;
    bankAddress?: string;
    swiftCode?: string;
    currency?: string[];
    intermediaryAccountNo?: string;
    intermediarySwiftCode?: string;
  };
  status: 'active' | 'inactive' | 'suspended';
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Vendor Schema
const VendorSchema = new Schema<IVendor>(
  {
    name: {
      type: String,
      required: [true, 'Vendor name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    tier: {
      type: String,
      required: [true, 'Vendor tier is required'],
      enum: ['tier_1', 'tier_2', 'tier_3'],
    },
    currency: {
      type: [String],
      required: [true, 'At least one currency is required'],
      validate: {
        validator: function (v: string[]) {
          return v && v.length > 0;
        },
        message: 'At least one currency must be provided',
      },
    },
    companyInfo: {
      companyName: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true,
      },
      website: {
        type: String,
        trim: true,
      },
      taxId: {
        type: String,
        trim: true,
      },
      panNumber: {
        type: String,
        trim: true,
      },
      msme: {
        type: String,
        trim: true,
      },
      cinNumber: {
        type: String,
        trim: true,
      },
    },
    address: {
      country: {
        type: String,
        trim: true,
      },
      stateProvince: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      zipCode: {
        type: String,
        trim: true,
      },
      completeAddress: {
        type: String,
        trim: true,
      },
    },
    redirects: {
      completeRedirect: {
        type: String,
        trim: true,
      },
      terminateRedirect: {
        type: String,
        trim: true,
      },
      quotaFullRedirect: {
        type: String,
        trim: true,
      },
      securityRedirect: {
        type: String,
        trim: true,
      },
    },
    bankDetails: {
      bankName: {
        type: String,
        trim: true,
      },
      accountType: {
        type: String,
        trim: true,
      },
      accountNumber: {
        type: String,
        trim: true,
      },
      accountHolderName: {
        type: String,
        trim: true,
      },
      ifscCode: {
        type: String,
        trim: true,
      },
      micrCode: {
        type: String,
        trim: true,
      },
      bankAddress: {
        type: String,
        trim: true,
      },
      swiftCode: {
        type: String,
        trim: true,
      },
      currency: {
        type: [String],
        trim: true,
      },
      intermediaryAccountNo: {
        type: String,
        trim: true,
      },
      intermediarySwiftCode: {
        type: String,
        trim: true,
      },
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
    createdBy: {
      type: String,
      required: [true, 'Created by is required'],
    },
    updatedBy: {
      type: String,
      required: [true, 'Updated by is required'],
    },
  },
  {
    timestamps: true,
  }
);

// JSON transformation
VendorSchema.set('toJSON', {
  transform: (_doc, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Vendor = mongoose.model<IVendor>('Vendor', VendorSchema);
export default Vendor;
