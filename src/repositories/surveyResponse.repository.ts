import SurveyResponse, { ISurveyResponse } from '../models/SurveyResponse';
import type { SurveyResponseStatus } from '../common/constants/surveyStatus';

export const surveyResponseRepository = {
  // Create a new survey response
  async create(responseData: Partial<ISurveyResponse>): Promise<ISurveyResponse> {
    const response = new SurveyResponse(responseData);
    return await response.save();
  },

  // Find response by ID
  async findById(id: string): Promise<ISurveyResponse | null> {
    return await SurveyResponse.findById(id);
  },

  // Find response by uid and survey ID
  async findByUidAndSurvey(uid: string, surveyId: string): Promise<ISurveyResponse | null> {
    return await SurveyResponse.findOne({ uid, surveyId });
  },

  // Update response status
  async updateStatus(
    uid: string,
    surveyId: string,
    status: SurveyResponseStatus,
    completedAt?: Date
  ): Promise<ISurveyResponse | null> {
    const updateData: any = { status };
    if (completedAt) {
      updateData.completedAt = completedAt;
    }
    return await SurveyResponse.findOneAndUpdate({ uid, surveyId }, updateData, { new: true });
  },

  // Get all responses for a survey
  async getBySurveyId(surveyId: string): Promise<ISurveyResponse[]> {
    return await SurveyResponse.find({ surveyId }).sort({ createdAt: -1 });
  },

  // Get responses with pagination
  async list(options: {
    surveyId?: string;
    vendorId?: string;
    country?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    responses: ISurveyResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (options.surveyId) {
      filter.surveyId = options.surveyId;
    }

    if (options.vendorId) {
      filter.vendorId = options.vendorId;
    }

    if (options.country) {
      filter.country = options.country;
    }

    if (options.status) {
      filter.status = options.status;
    }

    const total = await SurveyResponse.countDocuments(filter);
    const responses = await SurveyResponse.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return {
      responses,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  // Count responses by status for a survey
  async countByStatus(surveyId: string): Promise<{
    initiated: number;
    completed: number;
    terminated: number;
    quotaFull: number;
    security: number;
  }> {
    const pipeline = [
      { $match: { surveyId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ];

    const results = await SurveyResponse.aggregate(pipeline);

    const counts = {
      initiated: 0,
      completed: 0,
      terminated: 0,
      quotaFull: 0,
      security: 0,
    };

    results.forEach((result) => {
      const status = result._id.toLowerCase().replace('_', '');
      if (status === 'initiated') counts.initiated = result.count;
      else if (status === 'completed') counts.completed = result.count;
      else if (status === 'terminated') counts.terminated = result.count;
      else if (status === 'quotafull') counts.quotaFull = result.count;
      else if (status === 'security') counts.security = result.count;
    });

    return counts;
  },
};
