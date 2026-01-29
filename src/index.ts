import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import serverConfig from './config/server';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';
import { generalRateLimiter } from './middleware/rateLimiter';
import routes from './routes';
import { NotFoundError } from './common/errors';

const createApp = (): Application => {
  const app = express();

  // Security middleware
  app.use(helmet());
  
  // CORS middleware
  app.use(cors(serverConfig.cors));

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  
  // Cookie parser
  app.use(cookieParser());

  // Compression middleware
  app.use(compression());

  // Request logging
  app.use(requestLogger);

  // Rate limiting
  app.use(generalRateLimiter);

  // API routes
  app.use('/api/v1', routes);

  // 404 handler
  app.use('*', (req, _res, next) => {
    next(new NotFoundError(`Route ${req.originalUrl} not found`));
  });

  // Global error handler (must be last)
  app.use(errorHandler);
  

  return app;
};

export default createApp;
