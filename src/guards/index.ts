import { Response, NextFunction } from 'express';
import { AuthRequest } from '../common/types';
import { AuthorizationError } from '../common/errors';

/**
 * Guard to check if user is authenticated
 */
export const isAuthenticated = (req: AuthRequest, _res: Response, next: NextFunction): void => {
  if (!req.user) {
    throw new AuthorizationError('You must be logged in to access this resource');
  }
  next();
};

/**
 * Guard to check if user owns the resource
 */
export const isOwner = (resourceUserId: string) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AuthorizationError('You must be logged in to access this resource');
    }

    if (req.user.id !== resourceUserId) {
      throw new AuthorizationError('You do not have permission to access this resource');
    }

    next();
  };
};

export default {
  isAuthenticated,
  isOwner,
};
