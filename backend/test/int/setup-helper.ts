import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export async function setupIntegration<TRepo, TService>({
  modules,
  repository,
  service,
}: {
  modules: any[];
  repository: new (...args: any[]) => TRepo;
  service: new (...args: any[]) => TService;
}) {
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot({
        type: 'postgres',
        url: process.env.TEST_DATABASE_URL,
        autoLoadEntities: true,
        synchronize: false,
      }),
      ...modules,
    ],
  }).compile();

  const dataSource = module.get(DataSource);
  const repositoryInstance = module.get(repository);
  const serviceInstance = module.get(service);

  return {
    module,
    dataSource,
    repository: repositoryInstance,
    service: serviceInstance,
  };
}
