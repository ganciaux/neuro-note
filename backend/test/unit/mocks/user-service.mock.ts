import { createMockService } from './service.mock';

export function createUsersServiceMock() {
  return {
    ...createMockService(),
    findBySlug: jest.fn(),
    validatePassword: jest.fn(),
    findActiveAdmins: jest.fn(),
    findByEmail: jest.fn(),
    findByEmailWithPassword: jest.fn(),
  };
}
