import mongoose from 'mongoose';
import logger from '../common/utils/logger';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pollsphere';
    
    await mongoose.connect(mongoUri);
    
    logger.info(`✅ MongoDB connected successfully to ${mongoose.connection.host}`);
    
    mongoose.connection.on('error', (error) => {
      logger.error('MongoDB connection error:', error);
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });
    
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed due to app termination');
      process.exit(0);
    });
    
  } catch (error) {
    logger.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDatabase;
