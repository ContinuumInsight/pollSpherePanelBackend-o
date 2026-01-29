import { Response, NextFunction } from 'express';
import { AuthRequest } from '../common/types';
import { verifyAccessToken } from '../common/utils/jwt';
import { AuthenticationError } from '../common/errors';
import { ERROR_MESSAGES } from '../common/constants';

/**
 * Middleware to authenticate user using JWT
 */
export const authenticate = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const payload = verifyAccessToken(token);

    // Attach user to request
    req.user = {
      id: payload.userId,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export default authenticate;
