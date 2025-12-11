import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersModule } from '../../../src/modules/users/users.module';
import { CommonModule } from '../../../src/common/common.module';
import { UsersRepository } from '../../../src/modules/users/repositories/users.repository';
import { UsersService } from '../../../src/modules/users/services/users.service';
import { setupIntegration } from '../setup-helper';
import { UserFactory } from '../../../src/common/factories/user.factory';
import { toDto } from '../../../src/common/utils/transform-to-dto';
import { UserResponseDto } from '../../../src/modules/users/dto/user-response.dto';
import { FIXED_EMAIL, FIXED_PASSWORD, FIXED_PASSWORD_ERROR } from '../../utils/constants';

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
    const dto = UserFactory.makeCreateDto({ email: FIXED_EMAIL });

    await usersService.create(dto);

    await expect(usersService.create(dto)).rejects.toThrow(ConflictException);

    const users = await usersRepository.findByEmail(dto.email);
    expect(users).not.toBeNull();
    const count = await usersRepository.count({ where: { email: dto.email } });
    expect(count).toBe(1);
  });

  describe('findBySlug', () => {
    it('returns the user when slug exists', async () => {
      const dto = UserFactory.makeCreateDto();

      const created = await usersService.create(dto);

      const result = await usersService.findBySlug(created.slug);

      expect(result).toBeDefined();
      expect(result.id).toBe(created.id);
      expect(result.slug).toBe(created.slug);
    });

    it('throws NotFoundException when slug does not exist', async () => {
      await expect(usersService.findBySlug('unknown-slug')).rejects.toThrow(NotFoundException);
    });
  });

  describe('validatePassword', () => {
    it('returns true when password matches', async () => {
      const dto = UserFactory.makeCreateDto({ password: FIXED_PASSWORD });

      const created = await usersService.create(dto);
      const userInDb = await usersRepository.findByEmailWithPassword(created.email);

      const result = await usersService.validatePassword(userInDb!, FIXED_PASSWORD);

      expect(result).toBe(true);
    });

    it('returns false when password does NOT match', async () => {
      const dto = UserFactory.makeCreateDto({ password: FIXED_PASSWORD });

      const created = await usersService.create(dto);
      const userInDb = await usersRepository.findByEmailWithPassword(created.email);

      const result = await usersService.validatePassword(userInDb!, FIXED_PASSWORD_ERROR);

      expect(result).toBe(false);
    });

    it('throws when passwordHash is missing', async () => {
      const dto = UserFactory.makeCreateDto({ password: FIXED_PASSWORD });

      const created = await usersService.create(dto);
      const userInDb = await usersRepository.findOneBy({ id: created.id });

      await expect(usersService.validatePassword(userInDb!, FIXED_PASSWORD_ERROR)).rejects.toThrow(
        Error,
      );
    });
  });
});
