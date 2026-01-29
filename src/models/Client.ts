import mongoose, { Document, Schema } from 'mongoose';

// Client interface
export interface IClient extends Document {
  name: string;
  email: string;
  phone: string;
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
  status: 'active' | 'inactive' | 'suspended';
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Client Schema
const ClientSchema = new Schema<IClient>(
  {
    name: {
      type: String,
      required: [true, 'Client name is required'],
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
ClientSchema.set('toJSON', {
  transform: (_doc, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Client = mongoose.model<IClient>('Client', ClientSchema);
export default Client;
