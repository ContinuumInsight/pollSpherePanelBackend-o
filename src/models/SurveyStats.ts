import mongoose, { Document, Schema } from 'mongoose';

export interface ISurveyStatsCounters {
  initiated: number;
  completed: number;
  terminated: number;
  quota_full: number;
  security: number;
}

// Single collection used for overall/country/vendor level stats.
// - overall:  { survey_id, country: null, vendor_id: null }
// - country:  { survey_id, country: 'IN', vendor_id: null }
// - vendor:   { survey_id, country: 'IN', vendor_id: 'vendor123' }
export interface ISurveyStats extends Document {
  survey_id: string;
  vendor_id: string | null;
  country: string | null;
  stats: ISurveyStatsCounters;
  created_at: Date;
  last_updated: Date;
}

const SurveyStatsSchema = new Schema<ISurveyStats>(
  {
    survey_id: {
      type: String,
      required: true,
      index: true,
    },
    vendor_id: {
      type: String,
      default: null,
      index: true,
    },
    country: {
      type: String,
      default: null,
      index: true,
    },
    stats: {
      initiated: { type: Number, default: 0 },
      completed: { type: Number, default: 0 },
      quota_full: { type: Number, default: 0 },
      security: { type: Number, default: 0 },
      terminated: { type: Number, default: 0 },
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'last_updated' },
  }
);

// Ensures one row per (survey_id, country, vendor_id)
SurveyStatsSchema.index({ survey_id: 1, country: 1, vendor_id: 1 }, { unique: true });

SurveyStatsSchema.set('toJSON', {
  transform: (_doc, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const SurveyStats = mongoose.model<ISurveyStats>('SurveyStats', SurveyStatsSchema);
export default SurveyStats;
