import { createMockRepository } from './repository.mock';

export function createPatientsRepositoryMock() {
  return {
    ...createMockRepository(),
  };
}
