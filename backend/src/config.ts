import * as dotenv from 'dotenv';
dotenv.config();

export const dbBaseConfig = {
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USER || 'neuro',
  password: process.env.DATABASE_PASSWORD || 'neuro',
  database: process.env.DATABASE_NAME || 'neuronote',
};