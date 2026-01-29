import dotenv from 'dotenv';
import createApp from './src/index';
import connectDatabase from './src/config/database';
import serverConfig from './src/config/server';
import logger from './src/common/utils/logger';

// Load environment variables
dotenv.config();

// Create Express app
const app = createApp();

// Start server
const startServer = async (): Promise<void> => {
  try {
    // Connect to database
    await connectDatabase();

    // Start listening
    app.listen(serverConfig.port, () => {
      console.log('\n' + '='.repeat(60));
      console.log(`✅ Backend started successfully on port ${serverConfig.port}`);
      console.log(`✅ Database connected successfully`);
      console.log(`🚀 Server running in ${serverConfig.nodeEnv} mode`);
      console.log(`📡 Health check: http://localhost:${serverConfig.port}/api/v1/health`);
      console.log('='.repeat(60) + '\n');
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: Error) => {
  logger.error('Unhandled Rejection:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start the server
startServer(); 
