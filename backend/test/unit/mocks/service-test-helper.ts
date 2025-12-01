import { Test, TestingModule } from '@nestjs/testing';
import { createMockRepository } from './repository.mock';

export async function createServiceTestModule<TService, TRepository>(
  serviceClass: new (...args: any[]) => TService,
  repositoryClass: new (...args: any[]) => TRepository,
  customMock?: any,
) {
  const repositoryMock = customMock ?? custcreateMockRepository();

  const module: TestingModule = await Test.createTestingModule({
    providers: [
      serviceClass,
      {
        provide: repositoryClass,
        useValue: repositoryMock,
      },
    ],
  }).compile();

  return {
    module,
    service: module.get<TService>(serviceClass),
    repository: module.get<TRepository>(repositoryClass),
    repositoryMock,
  };
}
