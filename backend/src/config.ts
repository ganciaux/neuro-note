import * as dotenv from 'dotenv';
dotenv.config();

type LogLevel = 'query' | 'error' | 'schema' | 'warn' | 'info' | 'log' | 'migration';

export const dbBaseConfig = {
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USER || 'neuro',
  password: process.env.DATABASE_PASSWORD || 'neuro',
  database: process.env.DATABASE_NAME || 'neuronote',
  logging: ((): LogLevel[] => {
    const env = process.env.DATABASE_LOGGING as LogLevel | 'all' | undefined;
    if (env === 'all') return ['query', 'error', 'schema', 'warn', 'info', 'log', 'migration'];
    if (env) return [env];
    return ['error'];
  })(),
  logger:
    (process.env.DATABASE_LOGGER as
      | 'advanced-console'
      | 'simple-console'
      | 'formatted-console'
      | 'file'
      | 'debug') || 'advanced-console',
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
