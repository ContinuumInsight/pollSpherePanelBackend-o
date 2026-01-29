import { Router } from 'express';
import authRoutes from './auth.routes';
import vendorRoutes from './vendor.routes';
import clientRoutes from './client.routes';
import filterRoutes from './filter.routes';
import surveyRoutes from './survey.routes';

const router = Router();

// Health check endpoint
router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/vendors', vendorRoutes);
router.use('/clients', clientRoutes);
router.use('/filters', filterRoutes);
router.use('/surveys', surveyRoutes);

export default router;
