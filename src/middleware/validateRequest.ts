import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ValidationError } from '../common/errors';
import { ERROR_MESSAGES } from '../common/constants';

/**
 * Middleware to validate request using Zod schema
 */
export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(error);
      } else {
        next(new ValidationError(ERROR_MESSAGES.VALIDATION_ERROR));
      }
    }
  };
};

export default validateRequest;
