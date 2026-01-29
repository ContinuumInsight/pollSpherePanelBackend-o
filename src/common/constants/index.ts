export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
  FINANCE_MANAGER: 'finance_manager',
} as const;

export const ERROR_MESSAGES = {
  // Auth errors
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
  USER_ALREADY_EXISTS: 'User with this email already exists',
  UNAUTHORIZED: 'Unauthorized access',
  TOKEN_EXPIRED: 'Token has expired',
  TOKEN_INVALID: 'Invalid token',
  REFRESH_TOKEN_INVALID: 'Invalid refresh token',
  
  // Validation errors
  VALIDATION_ERROR: 'Validation error',
  INVALID_INPUT: 'Invalid input data',
  
  // Server errors
  INTERNAL_SERVER_ERROR: 'Internal server error',
  SERVICE_UNAVAILABLE: 'Service temporarily unavailable',
  
  // Rate limiting
  TOO_MANY_REQUESTS: 'Too many requests, please try again later',
} as const;

export const SUCCESS_MESSAGES = {
  USER_REGISTERED: 'User registered successfully',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  TOKEN_REFRESHED: 'Token refreshed successfully',
} as const;

export const TOKEN_TYPES = {
  ACCESS: 'access',
  REFRESH: 'refresh',
} as const;

export * from './surveyStatus';

export default {
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  USER_ROLES,
  TOKEN_TYPES,
};
