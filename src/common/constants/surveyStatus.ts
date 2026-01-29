// Centralized survey status constants + types

export const SURVEY_STATUS = ['LP', 'LIVE', 'CLOSED', 'PAUSE', 'INVOICED', 'PAID'] as const;
export type SurveyStatus = (typeof SURVEY_STATUS)[number];

// Status values used for respondent callbacks / response tracking.
// Accept both QUOTA and QUOTA_FULL (some integrations send QUOTA).
export const SURVEY_RESPONSE_STATUS = [
  'INITIATED',
  'SECURITY',
  'QUOTA',
  'QUOTA_FULL',
  'COMPLETED',
  'TERMINATED',
] as const;
export type SurveyResponseStatus = (typeof SURVEY_RESPONSE_STATUS)[number];

// Canonical callback statuses (the ones we expect from the survey callback route).
export const SURVEY_CALLBACK_STATUS = ['COMPLETED', 'TERMINATED', 'QUOTA', 'QUOTA_FULL', 'SECURITY'] as const;
export type SurveyCallbackStatus = (typeof SURVEY_CALLBACK_STATUS)[number];
