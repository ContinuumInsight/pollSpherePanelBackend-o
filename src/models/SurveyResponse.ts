import mongoose, { Document, Schema } from 'mongoose';
import { SURVEY_RESPONSE_STATUS, type SurveyResponseStatus } from '../common/constants/surveyStatus';

export interface ISurveyResponse extends Document {
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

const SurveyResponseSchema = new Schema<ISurveyResponse>(
  {
    surveyId: {
      type: String,
      required: true,
      index: true,
    },
    psCode: {
      type: Number,
      required: true,
      index: true,
    },
    uid: {
      type: String,
      required: true,
      index: true,
    },
    vendorId: {
      type: String,
      required: true,
      index: true,
    },
    vendorName: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: SURVEY_RESPONSE_STATUS,
      default: 'INITIATED',
      index: true,
    },
    ipAddress: String,
    userAgent: String,
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Compound index for tracking
SurveyResponseSchema.index({ surveyId: 1, uid: 1 }, { unique: true });
SurveyResponseSchema.index({ surveyId: 1, vendorId: 1, country: 1 });
SurveyResponseSchema.index({ surveyId: 1, status: 1 });

// JSON transformation
SurveyResponseSchema.set('toJSON', {
  transform: (_doc, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const SurveyResponse = mongoose.model<ISurveyResponse>('SurveyResponse', SurveyResponseSchema);
export default SurveyResponse;
