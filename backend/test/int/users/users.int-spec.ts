import { UsersModule } from '../../../src/modules/users/users.module';
import { CommonModule } from '../../../src/common/common.module';
import { UsersRepository } from '../../../src/modules/users/repositories/users.repository';
import { UsersService } from '../../../src/modules/users/services/users.service';
import { setupIntegration } from '../setup-helper';
import { UserFactory } from '../../../src/common/factories/user.factory';
import { toDto, toDtoArray } from '../../../src/common/utils/transform-to-dto';
import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';

describe('Users Integration Test', () => {
  let usersRepository: UsersRepository;
  let usersService: UsersService;

  beforeAll(async () => {
    const setup = await setupIntegration({
      modules: [UsersModule, CommonModule],
      repository: UsersRepository,
      service: UsersService,
    });

    usersRepository = setup.repository;
    usersService = setup.service;
  });

   beforeEach(async () => {
    await usersRepository.delete({});
  });

  it('should create a user', async () => {
    const create = UserFactory.makeEntityForCreate();
    const createdUser = usersRepository.create(create);

    const savedUser = await usersRepository.save(createdUser);

    expect(savedUser.id).toBeDefined();
  });

  it('should create a user', async () => {
    const createDto = UserFactory.makeCreateDto();
    const createdUser = await usersService.create(createDto);

    expect(createdUser.id).toBeDefined();
    expect(createdUser).not.toHaveProperty('password');
    expect(createdUser).not.toHaveProperty('passwordHash');
  });
});
