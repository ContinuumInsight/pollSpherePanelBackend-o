import { Request, Response, NextFunction } from 'express';
import { AppError } from '../common/errors';
import { HTTP_STATUS, ERROR_MESSAGES } from '../common/constants';
import logger from '../common/utils/logger';
import { ZodError } from 'zod';
import mongoose from 'mongoose';

/**
 * Global error handler middleware
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log error
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Handle AppError (custom errors)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const errors = err.errors.map((error) => ({
      field: error.path.join('.'),
      message: error.message,
    }));

    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: ERROR_MESSAGES.VALIDATION_ERROR,
      errors,
    });
    return;
  }

  // Handle Mongoose validation errors
  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((error) => ({
      field: error.path,
      message: error.message,
    }));

    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: ERROR_MESSAGES.VALIDATION_ERROR,
      errors,
    });
    return;
  }

  // Handle Mongoose duplicate key error
  if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyPattern)[0];
    res.status(HTTP_STATUS.CONFLICT).json({
      success: false,
      message: `${field} already exists`,
    });
    return;
  }

  // Handle Mongoose cast error (invalid ObjectId)
  if (err instanceof mongoose.Error.CastError) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Invalid ID format',
    });
    return;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: ERROR_MESSAGES.TOKEN_INVALID,
    });
    return;
  }

  if (err.name === 'TokenExpiredError') {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: ERROR_MESSAGES.TOKEN_EXPIRED,
    });
    return;
  }

  // Default error response
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

export default errorHandler;
