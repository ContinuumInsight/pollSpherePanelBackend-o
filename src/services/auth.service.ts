import * as userRepository from '../repositories/user.repository';
import { IUser } from '../models/User';
import {
  RegisterDTO,
  LoginDTO,
  AuthResponseDTO,
  ChangePasswordDTO,
  UpdateUserDTO,
} from '../dtos/auth.dto';
import {
  ConflictError,
  AuthenticationError,
  NotFoundError,
} from '../common/errors';
import { ERROR_MESSAGES } from '../common/constants';
import { comparePassword } from '../common/utils/password';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../common/utils/jwt';
import logger from '../common/utils/logger';

/**
 * Format auth response
 */
const formatAuthResponse = (user: IUser, accessToken: string, refreshToken: string): AuthResponseDTO => {
  return {
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
    },
    accessToken,
    refreshToken,
  };
};

/**
 * Register a new user
 */
export const register = async (data: RegisterDTO): Promise<AuthResponseDTO> => {
  // Check if user already exists
  const existingUser = await userRepository.findByEmail(data.email);
  if (existingUser) {
    throw new ConflictError(ERROR_MESSAGES.USER_ALREADY_EXISTS);
  }

  // Create user
  const user = await userRepository.create({
    email: data.email,
    password: data.password,
    name: data.name,
  });

  // Generate tokens
  const accessToken = generateAccessToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  // Save refresh token
  await userRepository.updateRefreshToken(user._id, refreshToken);

  logger.info(`User registered successfully: ${user.email}`);

  return formatAuthResponse(user, accessToken, refreshToken);
};

/**
 * Login user
 */
export const login = async (data: LoginDTO): Promise<AuthResponseDTO> => {
  // Find user with password
  const user = await userRepository.findByEmail(data.email, true);
  if (!user) {
    throw new AuthenticationError(ERROR_MESSAGES.INVALID_CREDENTIALS);
  }

  // Check if user is active
  if (!user.isActive) {
    throw new AuthenticationError('Your account has been deactivated');
  }

  // Verify password
  const isPasswordValid = await comparePassword(data.password, user.password);
  if (!isPasswordValid) {
    throw new AuthenticationError(ERROR_MESSAGES.INVALID_CREDENTIALS);
  }

  // Generate tokens
  const accessToken = generateAccessToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  // Update refresh token and last login
  await userRepository.updateRefreshToken(user._id, refreshToken);
  await userRepository.updateLastLogin(user._id);

  logger.info(`User logged in successfully: ${user.email}`);

  return formatAuthResponse(user, accessToken, refreshToken);
};

/**
 * Refresh access token
 */
export const refreshToken = async (token: string): Promise<{ accessToken: string; refreshToken: string }> => {
  // Verify refresh token
  const payload = verifyRefreshToken(token);

  // Find user
  const user = await userRepository.findById(payload.userId);
  if (!user) {
    throw new AuthenticationError(ERROR_MESSAGES.USER_NOT_FOUND);
  }

  if (!user.isActive) {
    throw new AuthenticationError('Your account has been deactivated');
  }

  // Generate new tokens
  const accessToken = generateAccessToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  const newRefreshToken = generateRefreshToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  // Update refresh token
  await userRepository.updateRefreshToken(user._id, newRefreshToken);

  logger.info(`Token refreshed for user: ${user.email}`);

  return { accessToken, refreshToken: newRefreshToken };
};

/**
 * Logout user
 */
export const logout = async (userId: string): Promise<void> => {
  // Clear refresh token
  await userRepository.updateRefreshToken(userId, null);
  logger.info(`User logged out: ${userId}`);
};

/**
 * Change password
 */
export const changePassword = async (userId: string, data: ChangePasswordDTO): Promise<{ message: string }> => {
  // Find user with password
  const user = await userRepository.findById(userId, true);
  if (!user) {
    throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
  }

  // Verify current password
  const isPasswordValid = await comparePassword(data.currentPassword, user.password);
  if (!isPasswordValid) {
    throw new AuthenticationError('Current password is incorrect');
  }

  // Update password
  user.password = data.newPassword;
  await user.save();

  // Clear all refresh tokens
  await userRepository.updateRefreshToken(user._id, null);

  logger.info(`Password changed for user: ${user.email}`);

  return { message: 'Password changed successfully' };
};

/**
 * Get current user
 */
export const getCurrentUser = async (userId: string): Promise<IUser> => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
  }
  return user;
};

/**
 * Update user profile
 */
export const updateUser = async (userId: string, data: UpdateUserDTO): Promise<IUser> => {
  // If email is being updated, check if it's already taken
  if (data.email) {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser && existingUser._id.toString() !== userId) {
      throw new ConflictError(ERROR_MESSAGES.USER_ALREADY_EXISTS);
    }
  }

  const user = await userRepository.updateById(userId, data);
  
  logger.info(`User updated: ${user.email}`);
  
  return user;
};

/**
 * Delete user account
 */
export const deleteUser = async (userId: string): Promise<void> => {
  await userRepository.deleteById(userId);
  
  logger.info(`User deleted: ${userId}`);
};
