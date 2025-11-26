import { Test, TestingModule } from '@nestjs/testing';
import { UUID } from 'crypto';
import { UsersController } from 'src/modules/users/controllers/users.controller';
import { UsersService } from 'src/modules/users/services/users.service';
import { v4 as uuidv4 } from 'uuid';

describe('UsersController', () => {
  let controller: UsersController;
  const uuid = uuidv4();

  const mockUsersService = {
    findAll: jest.fn().mockResolvedValue([{ id: uuid, name: 'John' }]),
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
    expect(users).toEqual([{ id: uuid, name: 'John' }]);
  });
});
