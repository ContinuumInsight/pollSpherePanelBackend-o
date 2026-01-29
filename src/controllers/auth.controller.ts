import { Response } from 'express';
import * as authService from '../services/auth.service';
import { AuthRequest } from '../common/types';
import { sendSuccess, sendCreated } from '../common/response';
import { SUCCESS_MESSAGES } from '../common/constants';
import {
  RegisterInput,
  LoginInput,
  RefreshTokenInput,
  ChangePasswordInput,
  UpdateUserInput,
} from '../schemas/auth.schema';

/**
 * Register a new user
 * POST /api/v1/auth/register
 */
export const register = async (req: AuthRequest, res: Response): Promise<Response> => {
  const data: RegisterInput = req.body;
  const result = await authService.register(data);
  return sendCreated(res, result, SUCCESS_MESSAGES.USER_REGISTERED);
};

/**
 * Login user
 * POST /api/v1/auth/login
 */
export const login = async (req: AuthRequest, res: Response): Promise<Response> => {
  const data: LoginInput = req.body;
  const result = await authService.login(data);
  return sendSuccess(res, result, SUCCESS_MESSAGES.LOGIN_SUCCESS);
};

/**
 * Refresh access token
 * POST /api/v1/auth/refresh-token
 */
export const refreshToken = async (req: AuthRequest, res: Response): Promise<Response> => {
  const data: RefreshTokenInput = req.body;
  const result = await authService.refreshToken(data.refreshToken);
  return sendSuccess(res, result, SUCCESS_MESSAGES.TOKEN_REFRESHED);
};

/**
 * Logout user
 * POST /api/v1/auth/logout
 */
export const logout = async (req: AuthRequest, res: Response): Promise<Response> => {
  const userId = req.user!.id;
  await authService.logout(userId);
  return sendSuccess(res, null, SUCCESS_MESSAGES.LOGOUT_SUCCESS);
};

/**
 * Change password
 * POST /api/v1/auth/change-password
 */
export const changePassword = async (req: AuthRequest, res: Response): Promise<Response> => {
  const userId = req.user!.id;
  const data: ChangePasswordInput = req.body;
  const result = await authService.changePassword(userId, data);
  return sendSuccess(res, null, result.message);
};

/**
 * Get current user
 * GET /api/v1/auth/me
 */
export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<Response> => {
  const userId = req.user!.id;
  const user = await authService.getCurrentUser(userId);
  return sendSuccess(res, user, 'User fetched successfully');
};

/**
 * Update user profile
 * PUT /api/v1/auth/update
 */
export const updateUser = async (req: AuthRequest, res: Response): Promise<Response> => {
  const userId = req.user!.id;
  const data: UpdateUserInput = req.body;
  const user = await authService.updateUser(userId, data);
  return sendSuccess(res, user, 'User updated successfully');
};

/**
 * Delete user account
 * DELETE /api/v1/auth/delete
 */
export const deleteUser = async (req: AuthRequest, res: Response): Promise<Response> => {
  const userId = req.user!.id;
  await authService.deleteUser(userId);
  return sendSuccess(res, null, 'User account deleted successfully');
};
