import { Request, Response, NextFunction } from 'express';
import logger from '../common/utils/logger';

/**
 * Request logger middleware
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();

  // Log request
  logger.info(`➡️  ${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
    body: req.method !== 'GET' ? sanitizeBody(req.body) : undefined,
  });

  // Log response
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const level = res.statusCode >= 400 ? 'error' : 'info';

    logger[level](`⬅️  ${req.method} ${req.path} ${res.statusCode} - ${duration}ms`, {
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    });
  });

  next();
};

/**
 * Sanitize request body to avoid logging sensitive data
 */
const sanitizeBody = (body: any): any => {
  if (!body || typeof body !== 'object') {
    return body;
  }

  const sanitized = { ...body };
  const sensitiveFields = ['password', 'token', 'refreshToken', 'currentPassword', 'newPassword'];

  sensitiveFields.forEach((field) => {
    if (sanitized[field]) {
      sanitized[field] = '***REDACTED***';
    }
  });

  return sanitized;
};

export default requestLogger;
