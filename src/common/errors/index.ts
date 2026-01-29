import { HTTP_STATUS } from '../constants';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, HTTP_STATUS.BAD_REQUEST);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string) {
    super(message, HTTP_STATUS.UNAUTHORIZED);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string) {
    super(message, HTTP_STATUS.FORBIDDEN);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, HTTP_STATUS.NOT_FOUND);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, HTTP_STATUS.CONFLICT);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string) {
    super(message, HTTP_STATUS.TOO_MANY_REQUESTS);
  }
}

export default {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
};
