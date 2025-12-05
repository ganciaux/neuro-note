import { Test, TestingModule } from '@nestjs/testing';

export async function createServiceTestModule<TService>(
  serviceClass: new (...args: any[]) => TService,
  providerMocks: Array<{ provide: any; useValue: any }> = [],
) {
  const providers = [serviceClass, ...providerMocks];

  const module: TestingModule = await Test.createTestingModule({ providers }).compile();

  return {
    module,
    service: module.get<TService>(serviceClass),
    providerMocks,
  };
}
