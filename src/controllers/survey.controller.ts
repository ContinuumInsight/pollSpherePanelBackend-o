import { Request, Response } from 'express';
import { surveyService } from '../services/survey.service';
import { CreateSurveyInput, UpdateSurveyInput, ListSurveysInput, ChangeStatusInput } from '../schemas/survey.schema';
import { SURVEY_CALLBACK_STATUS, type SurveyCallbackStatus } from '../common/constants/surveyStatus';
import fs from 'fs';
import path from 'path';

export const surveyController = {
  // Create survey
  async createSurvey(req: Request, res: Response) {
    const data = req.body as CreateSurveyInput;
    const userId = (req as any).user.id;

    const survey = await surveyService.createSurvey(data, userId);

    res.status(201).json({
      success: true,
      message: 'Survey created successfully',
      data: survey,
    });
  },

  // List surveys
  async listSurveys(req: Request, res: Response) {
    const data = req.body as ListSurveysInput;

    const result = await surveyService.listSurveys(data);

    res.status(200).json({
      success: true,
      message: 'Surveys fetched successfully',
      data: result.surveys,
      pagination: result.pagination,
    });
  },

  // Get survey by ID
  async getSurvey(req: Request, res: Response) {
    const { id } = req.params;

    const survey = await surveyService.getSurveyById(id);

    res.status(200).json({
      success: true,
      message: 'Survey fetched successfully',
      data: survey,
    });
  },

  // Update survey
  async updateSurvey(req: Request, res: Response) {
    const { id } = req.params;
    const data = req.body as UpdateSurveyInput;
    const userId = (req as any).user.id;

    const survey = await surveyService.updateSurvey(id, data, userId);

    res.status(200).json({
      success: true,
      message: 'Survey updated successfully',
      data: survey,
    });
  },

  // Change survey status
  async changeStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body as ChangeStatusInput;

    const survey = await surveyService.changeStatus(id, status);

    res.status(200).json({
      success: true,
      message: 'Survey status updated successfully',
      data: survey,
    });
  },

  // Delete survey
  async deleteSurvey(req: Request, res: Response) {
    const { id } = req.params;

    await surveyService.deleteSurvey(id);

    res.status(200).json({
      success: true,
      message: 'Survey deleted successfully',
    });
  },

  // Survey start (vendor entry point - public)
  async surveyStart(req: Request, res: Response) {
    try {
      const { token, uid } = req.query as { token: string; uid: string };

      if (!token || !uid) {
        return res.status(400).send(
          surveyController.renderErrorPage('Missing required parameters: token and uid')
        );
      }

      const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const result = await surveyService.handleSurveyStart(token, uid, ipAddress, userAgent);

      // Direct redirect to survey URL
      return res.redirect(result.surveyUrl);
    } catch (error: any) {
      const html = surveyController.renderErrorPage(error.message || 'An error occurred');
      return res.status(400).send(html);
    }
  },

  // Survey callback (client completion - public)
  async surveyCallback(req: Request, res: Response) {
    try {
      const { survey_id } = req.params;
      const { status, uid } = req.query as { status: string; uid: string };

      if (!status || !uid) {
        return res.status(400).send(
          surveyController.renderErrorPage('Missing required parameters: status and uid')
        );
      }

      if (!SURVEY_CALLBACK_STATUS.includes(status as SurveyCallbackStatus)) {
        return res.status(400).send(surveyController.renderErrorPage('Invalid status'));
      }

      const result = await surveyService.handleSurveyCallback(
        survey_id,
        uid,
        status as SurveyCallbackStatus
      );

      // Render callback page with redirect
      const html = surveyController.renderCallbackPage(result.message, result.redirectUrl);

      return res.status(200).send(html);
    } catch (error: any) {
      const html = surveyController.renderErrorPage(error.message || 'An error occurred');
      return res.status(400).send(html);
    }
  },

  // Get survey responses
  async getSurveyResponses(req: Request, res: Response) {
    const { id } = req.params;
    const { page, limit } = req.query;

    const result = await surveyService.getSurveyResponses(
      id,
      page ? parseInt(page as string) : undefined,
      limit ? parseInt(limit as string) : undefined
    );

    res.status(200).json({
      success: true,
      message: 'Survey responses fetched successfully',
      data: result.responses,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
  },

  // Helper: Render start page
  renderStartPage(psCode: string, country: string, uid: string, surveyUrl: string): string {
    const templatePath = path.join(__dirname, '../views/survey-start.html');
    let html = fs.readFileSync(templatePath, 'utf-8');

    html = html.replace('{{psCode}}', psCode);
    html = html.replace('{{country}}', country);
    html = html.replace('{{uid}}', uid);
    html = html.replace('{{surveyUrl}}', surveyUrl);

    return html;
  },

  // Helper: Render error page
  renderErrorPage(errorMessage: string): string {
    const templatePath = path.join(__dirname, '../views/survey-error.html');
    let html = fs.readFileSync(templatePath, 'utf-8');

    html = html.replace('{{errorMessage}}', errorMessage);

    return html;
  },

  // Helper: Render callback page
  renderCallbackPage(message: string, redirectUrl: string): string {
    const templatePath = path.join(__dirname, '../views/survey-callback.html');
    let html = fs.readFileSync(templatePath, 'utf-8');

    html = html.replace('{{message}}', message);

    if (redirectUrl) {
      html = html.replace('{{redirectMessage}}', 'Redirecting you back to the vendor...');
      html = html.replace(
        '{{redirectScript}}',
        `setTimeout(function() { window.location.href = '${redirectUrl}'; }, 2000);`
      );
    } else {
      html = html.replace('{{redirectMessage}}', 'You can close this window now.');
      html = html.replace('{{redirectScript}}', '');
    }

    return html;
  },
};
