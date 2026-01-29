const config = {
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret_key_here',
  jwtExpiry: process.env.JWT_EXPIRY || '15m',
  jwtRefreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
  baseUrl: process.env.BASE_URL || 'http://localhost:8000',
  port: process.env.PORT || 8000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/pollsphere',
  nodeEnv: process.env.NODE_ENV || 'development',
};

export default config;
