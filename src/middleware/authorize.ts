import { Response, NextFunction } from 'express';
import { AuthRequest, UserRole } from '../common/types';
import { AuthorizationError } from '../common/errors';

/**
 * Middleware to authorize user based on roles
 */
export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new AuthorizationError('User not authenticated');
      }

      const userRole = req.user.role as UserRole;

      if (!allowedRoles.includes(userRole)) {
        throw new AuthorizationError('You do not have permission to access this resource');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default authorize;
