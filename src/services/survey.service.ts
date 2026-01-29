import { surveyRepository } from '../repositories/survey.repository';
import { surveyResponseRepository } from '../repositories/surveyResponse.repository';
import { surveyStatsRepository } from '../repositories/surveyStats.repository';
import type { ISurvey } from '../models/Survey';
import type { CreateSurveyDTO, ListSurveysDTO, UpdateSurveyDTO } from '../dtos/survey.dto';
import { surveyTokenUtils } from '../utils/surveyToken.util';
import config from '../config/config';
import { nanoid } from 'nanoid';
import type { SurveyCallbackStatus, SurveyResponseStatus, SurveyStatus } from '../common/constants/surveyStatus';

export const surveyService = {
  // Create a new survey
  async createSurvey(data: CreateSurveyDTO, userId: string): Promise<ISurvey> {
    const psCode = await surveyRepository.getNextPsCode();
    const surveyId = nanoid(12);

    const basic = {
      name: data.basic.name,
      psCode,
      linkType: data.basic.linkType || 'single',
      loi: data.basic.loi,
      ir: data.basic.ir,
      device: data.basic.device || 'both',
      launchType: data.basic.launchType || 'full-launch',
      reconnectStudy: data.basic.reconnectStudy || 'no',
      isInternalPanel: data.basic.isInternalPanel || false,
      startDate: data.basic.startDate ? new Date(data.basic.startDate) : undefined,
      endDate: data.basic.endDate ? new Date(data.basic.endDate) : undefined,
    };

    const countries = data.countries.map((country) => ({
      ...country,
      vendors: country.vendors.map((vendor) => {
        const token = surveyTokenUtils.generateSurveyToken({
          survey_id: surveyId,
          vendor_id: vendor.vendorId,
          country: country.country,
        });

        const startUrl = `${config.baseUrl}/api/v1/surveys/start?token=${token}&uid=[XXXX]`;

        return {
          ...vendor,
          quota: vendor.quota || false,
          isActive: vendor.isActive !== undefined ? vendor.isActive : true,
          redirects: vendor.redirects || {
            completeRedirect: undefined,
            quotaFullRedirect: undefined,
            terminateRedirect: undefined,
            securityRedirect: undefined,
          },
          startUrl,
        };
      }),
    }));

    const status: SurveyStatus = data.status || 'LP';

    const survey = await surveyRepository.create({
      surveyId,
      basic,
      client: data.client,
      countries,
      status,
      createdBy: userId,
      totalCompletes: 0,
      notes: data.notes,
    });

    return survey;
  },

  // List surveys with pagination
  async listSurveys(data: ListSurveysDTO) {
    const result = await surveyRepository.list(data);

    const surveysWithStats = await Promise.all(
      result.surveys.map(async (survey) => {
        const stats = await surveyStatsRepository.getBreakdown(survey.surveyId);
        return {
          ...survey.toJSON(),
          stats: stats || null,
        };
      })
    );

    return {
      surveys: surveysWithStats,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    };
  },

  // Get survey by ID
  async getSurveyById(id: string) {
    const survey = await surveyRepository.findById(id);
    if (!survey) {
      throw new Error('Survey not found');
    }

    const stats = await surveyStatsRepository.getBreakdown(survey.surveyId);

    return {
      ...survey.toJSON(),
      stats: stats || null,
    };
  },

  // Update survey
  async updateSurvey(id: string, data: UpdateSurveyDTO, userId: string): Promise<ISurvey> {
    const survey = await surveyRepository.findById(id);
    if (!survey) {
      throw new Error('Survey not found');
    }

    const updateData: any = {
      updatedBy: userId,
    };

    if (data.basic) {
      updateData.basic = {
        ...survey.basic,
        ...data.basic,
        psCode: survey.basic.psCode,
        startDate: data.basic.startDate ? new Date(data.basic.startDate) : survey.basic.startDate,
        endDate: data.basic.endDate ? new Date(data.basic.endDate) : survey.basic.endDate,
      };
    }

    if (data.client) {
      updateData.client = {
        ...survey.client,
        ...data.client,
      };
    }

    if (data.countries) {
      updateData.countries = data.countries.map((country) => ({
        ...country,
        vendors: country.vendors.map((vendor) => {
          const token = surveyTokenUtils.generateSurveyToken({
            survey_id: survey.surveyId,
            vendor_id: vendor.vendorId,
            country: country.country,
          });

          const startUrl = `${config.baseUrl}/api/v1/surveys/start?token=${token}&uid={{uid}}`;

          return {
            ...vendor,
            startUrl,
          };
        }),
      }));
    }

    if (data.status) {
      updateData.status = data.status;
    }

    if (data.notes !== undefined) {
      updateData.notes = data.notes;
    }

    const updatedSurvey = await surveyRepository.updateById(id, updateData);
    if (!updatedSurvey) {
      throw new Error('Failed to update survey');
    }

    return updatedSurvey;
  },

  // Change survey status
  async changeStatus(id: string, status: SurveyStatus): Promise<ISurvey> {
    const updatedSurvey = await surveyRepository.updateStatus(id, status);
    if (!updatedSurvey) {
      throw new Error('Survey not found');
    }
    return updatedSurvey;
  },

  // Delete survey
  async deleteSurvey(id: string): Promise<void> {
    const survey = await surveyRepository.findById(id);
    if (!survey) {
      throw new Error('Survey not found');
    }

    await surveyStatsRepository.deleteBySurveyId(survey.surveyId);
    await surveyRepository.deleteById(id);
  },

  // Handle survey start (vendor entry point)
  async handleSurveyStart(token: string, uid: string, ipAddress?: string, userAgent?: string) {
    if (!token || !uid) {
      throw new Error('Missing required parameters: token and uid');
    }

    const payload = surveyTokenUtils.verifySurveyToken(token);
    if (!payload) {
      throw new Error('Invalid or expired survey link');
    }

    if (!payload.survey_id || !payload.vendor_id || !payload.country) {
      throw new Error('Invalid survey token payload');
    }

    const survey = await surveyRepository.findBySurveyId(payload.survey_id);
    if (!survey) {
      throw new Error('Survey not found');
    }

    if (survey.status === 'CLOSED') {
      throw new Error('This survey is closed');
    }

    if (survey.status === 'PAUSE') {
      throw new Error('This survey is paused');
    }

    const country = survey.countries.find((c) => c.country === payload.country);
    if (!country) {
      throw new Error('Country not found in survey');
    }

    const vendor = country.vendors.find((v) => v.vendorId === payload.vendor_id);
    if (!vendor) {
      throw new Error('Vendor not found in survey');
    }

    if (!vendor.isActive) {
      throw new Error('This vendor is not active');
    }

    // Block duplicates: same uid cannot start again.
    const existingResponse = await surveyResponseRepository.findByUidAndSurvey(uid, survey.surveyId);
    if (existingResponse) {
      throw new Error('This uid has already started the survey');
    }

    // Get survey URL before creating records
    const surveyUrl = country.liveUrl || country.testUrl || '';
    if (!surveyUrl) {
      throw new Error('Survey URL is not configured for this country');
    }

    console.log("survey started ===>", { surveyId: survey.surveyId, uid, vendorId: vendor.vendorId, country: country.country });

    // Create response record
    await surveyResponseRepository.create({
      surveyId: survey.surveyId,
      psCode: survey.basic.psCode,
      uid,
      vendorId: vendor.vendorId,
      vendorName: vendor.vendorName,
      country: country.country,
      status: 'INITIATED',
      ipAddress,
      userAgent,
      startedAt: new Date(),
    });

    // Update stats at all three levels (overall, country, vendor)
    const statsResult = await surveyStatsRepository.updateAllLevels(
      survey.surveyId,
      country.country,
      vendor.vendorId,
      'initiated'
    );

    if (!statsResult.success) {
      console.warn('Some stats updates failed, but continuing with redirect:', statsResult.errors);
    }

    return {
      alreadyStarted: false,
      survey,
      vendor,
      country,
      surveyUrl,
      uid,
    };
  },

  // Handle survey callback (client completion)
  async handleSurveyCallback(surveyId: string, uid: string, status: SurveyCallbackStatus) {
    const survey = await surveyRepository.findBySurveyId(surveyId);
    if (!survey) {
      throw new Error('Survey not found');
    }

    const response = await surveyResponseRepository.findByUidAndSurvey(uid, surveyId);
    if (!response) {
      throw new Error('Survey response not found. Please start the survey first.');
    }

    const statusForStorage: SurveyResponseStatus = status === 'QUOTA' ? 'QUOTA_FULL' : status;

    await surveyResponseRepository.updateStatus(uid, surveyId, statusForStorage, new Date());

    // Update stats at all three levels (overall, country, vendor)
    await surveyStatsRepository.updateAllLevels(
      survey.surveyId,
      response.country,
      response.vendorId,
      this.getStatsField(statusForStorage)
    );

    if (statusForStorage === 'COMPLETED') {
      await surveyRepository.incrementCompletes(surveyId);
    }

    const country = survey.countries.find((c) => c.country === response.country);
    const vendor = country?.vendors.find((v) => v.vendorId === response.vendorId);

    let redirectUrl = '';
    if (vendor) {
      switch (statusForStorage) {
        case 'COMPLETED':
          redirectUrl = vendor.redirects?.completeRedirect || '';
          break;
        case 'TERMINATED':
          redirectUrl = vendor.redirects?.terminateRedirect || '';
          break;
        case 'QUOTA_FULL':
          redirectUrl = vendor.redirects?.quotaFullRedirect || '';
          break;
        case 'SECURITY':
          redirectUrl = vendor.redirects?.securityRedirect || '';
          break;
      }
    }

    return {
      status: statusForStorage,
      redirectUrl,
      message: this.getStatusMessage(statusForStorage),
    };
  },

  // Get survey responses
  async getSurveyResponses(surveyId: string, page?: number, limit?: number) {
    const survey = await surveyRepository.findBySurveyId(surveyId);
    if (!survey) {
      throw new Error('Survey not found');
    }

    return await surveyResponseRepository.list({
      surveyId,
      page,
      limit,
    });
  },

  // Helper: Convert status to stats field
  getStatsField(status: SurveyResponseStatus): 'initiated' | 'completed' | 'terminated' | 'quota_full' | 'security' {
    switch (status) {
      case 'INITIATED':
        return 'initiated';
      case 'COMPLETED':
        return 'completed';
      case 'TERMINATED':
        return 'terminated';
      case 'QUOTA':
      case 'QUOTA_FULL':
        return 'quota_full';
      case 'SECURITY':
        return 'security';
      default:
        return 'initiated';
    }
  },

  // Helper: Get status message
  getStatusMessage(status: SurveyResponseStatus | string): string {
    switch (status) {
      case 'COMPLETED':
        return 'Survey completed successfully!';
      case 'TERMINATED':
        return 'Survey terminated.';
      case 'QUOTA':
      case 'QUOTA_FULL':
        return 'Survey quota is full.';
      case 'SECURITY':
        return 'Security check failed.';
      default:
        return 'Survey status updated.';
    }
  },
};
