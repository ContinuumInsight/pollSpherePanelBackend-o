import { Router } from 'express';
import { surveyController } from '../controllers/survey.controller';
import { authenticate } from '../middleware/authenticate';
import { validateRequest } from '../middleware/validateRequest';
import { asyncHandler } from '../middleware/asyncHandler';
import {
  createSurveySchema,
  updateSurveySchema,
  listSurveysSchema,
  changeStatusSchema,
} from '../schemas/survey.schema';

const router = Router();

// Public routes (no authentication)
router.get('/start', asyncHandler(surveyController.surveyStart));
router.get('/callback/:survey_id', asyncHandler(surveyController.surveyCallback));

// Protected routes (require authentication)
router.post(
  '/create',
  authenticate,
  validateRequest(createSurveySchema),
  asyncHandler(surveyController.createSurvey)
);

router.post(
  '/listSurveys',
  authenticate,
  validateRequest(listSurveysSchema),
  asyncHandler(surveyController.listSurveys)
);

router.get('/getSurvey/:id', authenticate, asyncHandler(surveyController.getSurvey));

router.put(
  '/update/:id',
  authenticate,
  validateRequest(updateSurveySchema),
  asyncHandler(surveyController.updateSurvey)
);

router.put(
  '/change-status/:id',
  authenticate,
  validateRequest(changeStatusSchema),
  asyncHandler(surveyController.changeStatus)
);

router.delete('/delete/:id', authenticate, asyncHandler(surveyController.deleteSurvey));

router.get('/surveyResponses/:id', authenticate, asyncHandler(surveyController.getSurveyResponses));

export default router;
