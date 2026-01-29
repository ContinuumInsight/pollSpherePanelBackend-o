import User, { IUser } from '../models/User';
import { NotFoundError } from '../common/errors';
import { ERROR_MESSAGES } from '../common/constants';
import mongoose from 'mongoose';

/**
 * Create a new user
 */
export const create = async (userData: Partial<IUser>): Promise<IUser> => {
  const user = new User(userData);
  return await user.save();
};

/**
 * Find user by email
 */
export const findByEmail = async (email: string, includePassword: boolean = false): Promise<IUser | null> => {
  let query = User.findOne({ email: email.toLowerCase() });
  
  if (includePassword) {
    query = query.select('+password');
  }
  
  return await query.exec();
};

/**
 * Find user by ID
 */
export const findById = async (id: string | mongoose.Types.ObjectId, includePassword: boolean = false): Promise<IUser | null> => {
  let query = User.findById(id);
  
  if (includePassword) {
    query = query.select('+password');
  }
  
  return await query.exec();
};

/**
 * Update user by ID
 */
export const updateById = async (id: string | mongoose.Types.ObjectId, updateData: Partial<IUser>): Promise<IUser> => {
  const user = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
  }

  return user;
};

/**
 * Update user refresh token
 */
export const updateRefreshToken = async (id: string | mongoose.Types.ObjectId, refreshToken: string | null): Promise<IUser> => {
  const user = await User.findByIdAndUpdate(
    id,
    { refreshToken },
    { new: true }
  );

  if (!user) {
    throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
  }

  return user;
};

/**
 * Update last login
 */
export const updateLastLogin = async (id: string | mongoose.Types.ObjectId): Promise<void> => {
  await User.findByIdAndUpdate(id, { lastLogin: new Date() });
};

/**
 * Delete user by ID
 */
export const deleteById = async (id: string | mongoose.Types.ObjectId): Promise<void> => {
  const result = await User.findByIdAndDelete(id);

  if (!result) {
    throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
  }
};

/**
 * Check if user exists by email
 */
export const existsByEmail = async (email: string): Promise<boolean> => {
  const count = await User.countDocuments({ email: email.toLowerCase() });
  return count > 0;
};

/**
 * Get all users with pagination
 */
export const findAll = async (
  page: number = 1,
  limit: number = 10,
  sortBy: string = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc'
): Promise<{ users: IUser[]; total: number; page: number; totalPages: number }> => {
  const skip = (page - 1) * limit;
  const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const [users, total] = await Promise.all([
    User.find().sort(sort).skip(skip).limit(limit).exec(),
    User.countDocuments(),
  ]);

  return {
    users,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};
