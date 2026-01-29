import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types';
import { AuthenticationError } from '../errors';
import { ERROR_MESSAGES, TOKEN_TYPES } from '../constants';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret_key_here';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '30d';

export const generateAccessToken = (payload: Omit<JWTPayload, 'type'>): string => {
  return jwt.sign(
    { ...payload, type: TOKEN_TYPES.ACCESS },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY } as jwt.SignOptions
  );
};

export const generateRefreshToken = (payload: Omit<JWTPayload, 'type'>): string => {
  return jwt.sign(
    { ...payload, type: TOKEN_TYPES.REFRESH },
    JWT_REFRESH_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRY } as jwt.SignOptions
  );
};

export const verifyAccessToken = (token: string): JWTPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    
    if (decoded.type !== TOKEN_TYPES.ACCESS) {
      throw new AuthenticationError(ERROR_MESSAGES.TOKEN_INVALID);
    }
    
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthenticationError(ERROR_MESSAGES.TOKEN_EXPIRED);
    }
    throw new AuthenticationError(ERROR_MESSAGES.TOKEN_INVALID);
  }
};

export const verifyRefreshToken = (token: string): JWTPayload => {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as JWTPayload;
    
    if (decoded.type !== TOKEN_TYPES.REFRESH) {
      throw new AuthenticationError(ERROR_MESSAGES.REFRESH_TOKEN_INVALID);
    }
    
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthenticationError(ERROR_MESSAGES.TOKEN_EXPIRED);
    }
    throw new AuthenticationError(ERROR_MESSAGES.REFRESH_TOKEN_INVALID);
  }
};

export const decodeToken = (token: string): JWTPayload | null => {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch {
    return null;
  }
};

export default {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken,
};
