import { Test, TestingModule } from '@nestjs/testing';

export async function createControllerTestModule<TController, TService>(
  controller: new (...args: any[]) => TController,
  serviceToken: any,
  mockService: TService,
) {
  const module: TestingModule = await Test.createTestingModule({
    controllers: [controller],
    providers: [{ provide: serviceToken, useValue: mockService }],
  }).compile();

  return module.get<TController>(controller);
}
