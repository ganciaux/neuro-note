import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from 'src/modules/users/controllers/users.controller';
import { UsersService } from 'src/modules/users/services/users.service';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    findAll: jest.fn().mockResolvedValue([{ id: 1, name: 'John' }]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all users', async () => {
    const users = await controller.findAll();
    expect(users).toEqual([{ id: 1, name: 'John' }]);
  });
});
