import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { asyncHandler } from '../middleware/asyncHandler';
import { validateRequest } from '../middleware/validateRequest';
import { authenticate } from '../middleware/authenticate';
import { authRateLimiter } from '../middleware/rateLimiter';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  changePasswordSchema,
  updateUserSchema,
} from '../schemas/auth.schema';

const router = Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/register',
  authRateLimiter,
  validateRequest(registerSchema),
  asyncHandler(authController.register)
);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  '/login',
  authRateLimiter,
  validateRequest(loginSchema),
  asyncHandler(authController.login)
);

/**
 * @route   POST /api/v1/auth/refresh-token
 * @desc    Refresh access token
 * @access  Public
 */
router.post(
  '/refresh-token',
  validateRequest(refreshTokenSchema),
  asyncHandler(authController.refreshToken)
);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post(
  '/logout',
  authenticate,
  asyncHandler(authController.logout)
);

/**
 * @route   POST /api/v1/auth/change-password
 * @desc    Change password
 * @access  Private
 */
router.post(
  '/change-password',
  authenticate,
  validateRequest(changePasswordSchema),
  asyncHandler(authController.changePassword)
);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get(
  '/me',
  authenticate,
  asyncHandler(authController.getCurrentUser)
);

/**
 * @route   PUT /api/v1/auth/update
 * @desc    Update user profile
 * @access  Private
 */
router.put(
  '/update',
  authenticate,
  validateRequest(updateUserSchema),
  asyncHandler(authController.updateUser)
);

/**
 * @route   DELETE /api/v1/auth/delete
 * @desc    Delete user account
 * @access  Private
 */
router.delete(
  '/delete',
  authenticate,
  asyncHandler(authController.deleteUser)
);




export default router;
