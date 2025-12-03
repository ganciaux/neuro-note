import { createMockRepository } from './repository.mock';

export function createUsersRepositoryMock() {
  return {
    ...createMockRepository(),
    findByEmail: jest.fn(),
    findBySlug: jest.fn(),
    findByEmailWithPassword: jest.fn(),
  };
}
