import * as dotenv from 'dotenv';
dotenv.config();

export const dbBaseConfig = {
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USER || 'neuro',
  password: process.env.DATABASE_PASSWORD || 'neuro',
  database: process.env.DATABASE_NAME || 'neuronote',
};

export const appConfig = {
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isDebug: (process.env.NODE_ENV || 'development') !== 'production',
};

export const jwtConfig: { secret: string; expiration: number } = {
  secret: process.env.JWT_SECRET || 'dev_secret_change_me',
  expiration: Number(process.env.JWT_EXPIRATION || 3600),
};
