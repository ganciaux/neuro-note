import { UsersService } from '../../../src/modules/users/services/users.service';
import { UsersRepository } from '../../../src/modules/users/repositories/users.repository';
import { createServiceTestModule } from '../mocks/service-test-helper';

const exampleUser = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  passwordHash: 'hashed',
  roleCode: 'admin',
  userName: 'johndoe',
  slug: 'john-doe-1234',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('UsersService Unit Tests', () => {
  let service: UsersService;
  let repositoryMock: any;

  beforeEach(async () => {
    const setup = await createServiceTestModule(UsersService, UsersRepository);

    service = setup.service;
    repositoryMock = setup.repositoryMock;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return list of users', async () => {
      repositoryMock.find.mockResolvedValue([exampleUser]);

      const result = await service.findAll();

      expect(result).toEqual([exampleUser]);
      expect(repositoryMock.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      repositoryMock.findOne.mockResolvedValue(exampleUser);

      const result = await service.findOne(exampleUser.id);

      expect(result).toEqual(exampleUser);
      expect(repositoryMock.findOne).toHaveBeenCalled();
    });
  });
});
