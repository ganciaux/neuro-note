import { DataSource } from 'typeorm';
import { dbBaseConfig } from './config';

export const AppDataSource = new DataSource({
  ...dbBaseConfig,
  type: 'postgres',
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
  synchronize: false,
});
