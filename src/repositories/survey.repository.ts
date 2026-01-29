import Survey, { ISurvey } from '../models/Survey';

export const surveyRepository = {
  // Generate next psCode atomically
  async getNextPsCode(): Promise<number> {
    const lastSurvey = await Survey.findOne().sort({ 'basic.psCode': -1 });
    const MIN_PS_CODE = 10000;

    if (!lastSurvey) return MIN_PS_CODE;

    const next = lastSurvey.basic.psCode + 1;
    return next < MIN_PS_CODE ? MIN_PS_CODE : next;
  },

  // Create a new survey
  async create(surveyData: Partial<ISurvey>): Promise<ISurvey> {
    const survey = new Survey(surveyData);
    return await survey.save();
  },

  // Find survey by ID
  async findById(id: string): Promise<ISurvey | null> {
    return await Survey.findById(id);
  },

  // Find survey by surveyId
  async findBySurveyId(surveyId: string): Promise<ISurvey | null> {
    return await Survey.findOne({ surveyId });
  },

  // Find survey by psCode
  async findByPsCode(psCode: number): Promise<ISurvey | null> {
    return await Survey.findOne({ 'basic.psCode': psCode });
  },

  // List surveys with pagination and filters
  async list(options: {
    page?: number;
    limit?: number;
    status?: string;
    clientId?: string;
    search?: string;
  }): Promise<{ surveys: ISurvey[]; total: number; page: number; limit: number; totalPages: number }> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (options.status) {
      filter.status = options.status;
    }

    if (options.clientId) {
      filter['client.clientId'] = options.clientId;
    }

    if (options.search) {
      filter.$or = [
        { 'basic.name': { $regex: options.search, $options: 'i' } },
        { surveyId: { $regex: options.search, $options: 'i' } },
      ];
    }

    const total = await Survey.countDocuments(filter);
    const surveys = await Survey.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return {
      surveys,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  // Update survey by ID
  async updateById(id: string, updateData: Partial<ISurvey>): Promise<ISurvey | null> {
    return await Survey.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  },

  // Update survey status
  async updateStatus(id: string, status: string): Promise<ISurvey | null> {
    return await Survey.findByIdAndUpdate(id, { status }, { new: true });
  },

  // Increment total completes
  async incrementCompletes(surveyId: string): Promise<void> {
    await Survey.findOneAndUpdate({ surveyId }, { $inc: { totalCompletes: 1 } });
  },

  // Delete survey by ID
  async deleteById(id: string): Promise<ISurvey | null> {
    return await Survey.findByIdAndDelete(id);
  },

  // Check if psCode exists
  async psCodeExists(psCode: number): Promise<boolean> {
    const count = await Survey.countDocuments({ 'basic.psCode': psCode });
    return count > 0;
  },
};
