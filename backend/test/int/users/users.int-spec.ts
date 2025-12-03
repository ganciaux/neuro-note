import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersModule } from '../../../src/modules/users/users.module';
import { CommonModule } from '../../../src/common/common.module';
import { UsersRepository } from '../../../src/modules/users/repositories/users.repository';
import { UsersService } from '../../../src/modules/users/services/users.service';
import { setupIntegration } from '../setup-helper';
import { UserFactory } from '../../../src/common/factories/user.factory';
import { toDto, toDtoArray } from '../../../src/common/utils/transform-to-dto';
import { UserResponseDto } from '../../../src/modules/users/dto/user-response.dto';

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
    await usersRepository.clear();
  });

  it('should create a user', async () => {
    const dto = UserFactory.makeCreateDto();
    const created = await usersService.create(dto);

    expect(created.id).toBeDefined();
    expect(created.email).toBe(dto.email);
    expect(created.userName).toBe(dto.userName);
    expect(created).toMatchObject({
      email: dto.email,
      userName: dto.userName,
    });
    expect(created).not.toHaveProperty('password');
    expect(created).not.toHaveProperty('passwordHash');

    const userInDb = await usersRepository.findOneBy({ id: created.id });

    expect(userInDb).not.toBeNull();
    expect(userInDb).toHaveProperty('passwordHash');
    expect(userInDb!.passwordHash).toBeUndefined();
    expect(created).toEqual(toDto(UserResponseDto, userInDb));

    const userInDbWithPassword = await usersRepository.findByEmailWithPassword(created.email);

    expect(userInDbWithPassword).not.toBeNull();
    expect(userInDbWithPassword!.passwordHash).toBeDefined();
    const isMatch = await bcrypt.compare(dto.password, userInDbWithPassword!.passwordHash);
    expect(isMatch).toBe(true);
  });

  it('should throw conflict if email already exists', async () => {
    const dto = UserFactory.makeCreateDto({ email: 'test@test.com' });

    await usersService.create(dto);

    await expect(usersService.create(dto)).rejects.toThrow(ConflictException);

    const users = await usersRepository.findByEmail(dto.email);
    expect(users).not.toBeNull();
    const count = await usersRepository.count({ where: { email: dto.email } });
    expect(count).toBe(1);
  });
});
