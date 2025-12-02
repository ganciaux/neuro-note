export const createMockService = () => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
  findOneExtended: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  count: jest.fn(),
  softDelete: jest.fn(),
  restore: jest.fn(),
  findDeleted: jest.fn(),
  search: jest.fn(),
});
