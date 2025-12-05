import { createMockService } from './service.mock';

export function createPatientsServiceMock() {
  return {
    ...createMockService(),
  };
}
