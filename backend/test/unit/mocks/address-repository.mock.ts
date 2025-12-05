import { createMockRepository } from './repository.mock';

export function createAddressesRepositoryMock() {
  return {
    ...createMockRepository(),
  };
}
