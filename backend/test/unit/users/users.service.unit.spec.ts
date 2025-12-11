import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../../../src/modules/users/services/users.service';
import { UsersRepository } from '../../../src/modules/users/repositories/users.repository';
import { createServiceTestModule } from '../mocks/service-test-helper';
import { UserFactory } from '../../../src/common/factories/user.factory';
import { createUsersRepositoryMock } from '../mocks/user-repository.mock';
import { UserResponseDto } from '../../../src/modules/users/dto/user-response.dto';
import { toDto } from '../../../src/common/utils/transform-to-dto';
import {
  FIXED_PASSWORD,
  FIXED_PASSWORD_HASH,
  FIXED_SLUG,
  FIXED_USERNAME,
  FIXED_UUID,
} from '../../utils/constants';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('UsersService Unit Tests', () => {
  let service: UsersService;
  let repositoryMock: any;

  beforeEach(async () => {
    repositoryMock = createUsersRepositoryMock();

    ({ service } = await createServiceTestModule(UsersService, [
      { provide: UsersRepository, useValue: repositoryMock },
    ]));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repositoryMock).toBeDefined();
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const date = new Date();
      const dto = UserFactory.makeCreateDto({ userName: FIXED_USERNAME });
      const entityForCreate = UserFactory.makeEntityForCreate({
        ...dto,
        passwordHash: FIXED_PASSWORD_HASH,
        slug: FIXED_SLUG,
      });
      const savedEntity = UserFactory.makeEntity({
        ...entityForCreate,
        id: FIXED_UUID,
        createdAt: date,
        updatedAt: date,
      });

      (bcrypt.hash as jest.Mock).mockResolvedValue(FIXED_PASSWORD_HASH);
      (repositoryMock.findByEmail as jest.Mock).mockResolvedValue(null);
      (repositoryMock.create as jest.Mock).mockReturnValue(entityForCreate);
      (repositoryMock.save as jest.Mock).mockResolvedValue(savedEntity);

      const result = await service.create(dto);

      expect(repositoryMock.findByEmail).toHaveBeenCalledWith(dto.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
      expect(repositoryMock.create).toHaveBeenCalled();
      expect(repositoryMock.save).toHaveBeenCalledWith(
        expect.objectContaining({
          ...dto,
          passwordHash: FIXED_PASSWORD_HASH,
          slug: FIXED_SLUG,
        }),
      );

      expect(result.id).toBe(FIXED_UUID);
      expect(result.email).toBe(dto.email);
      expect(result).not.toHaveProperty('password');
      expect(result).not.toHaveProperty('passwordHash');
      expect(result.slug).toBe(FIXED_SLUG);
      expect(result).toEqual(toDto(UserResponseDto, savedEntity));
    });

    it('should throw ConflictException if email exists', async () => {
      const dto = UserFactory.makeCreateDto();
      const existingUser = UserFactory.makeEntity();

      (repositoryMock.findByEmail as jest.Mock).mockResolvedValue(existingUser);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findBySlug', () => {
    it('should return user', async () => {
      const entity = UserFactory.makeEntity();

      (repositoryMock.findBySlug as jest.Mock).mockResolvedValue(entity);

      const result = await service.findBySlug(entity.slug);

      expect(repositoryMock.findBySlug).toHaveBeenCalledWith(entity.slug);
      expect(result.slug).toBe(entity.slug);
      expect(result).toEqual(toDto(UserResponseDto, entity));
    });

    it('should throw if not found', async () => {
      (repositoryMock.findBySlug as jest.Mock).mockResolvedValue(null);

      await expect(service.findBySlug('unknown')).rejects.toThrow(NotFoundException);
    });
  });

  describe('validatePassword', () => {
    it('should return true if password matches', async () => {
      const user = UserFactory.makeEntity({ passwordHash: FIXED_PASSWORD_HASH });

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validatePassword(user, FIXED_PASSWORD);

      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(FIXED_PASSWORD, user.passwordHash);
    });

    it('should return false if password mismatch', async () => {
      const user = UserFactory.makeEntity({ passwordHash: FIXED_PASSWORD_HASH });

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validatePassword(user, FIXED_PASSWORD);
      expect(result).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalledWith(FIXED_PASSWORD, user.passwordHash);
    });
  });

  describe('findByEmail', () => {
    it('should call repository', async () => {
      const user = UserFactory.makeEntityWithoutPassword();

      (repositoryMock.findByEmail as jest.Mock).mockResolvedValue(user);

      const result = await service.findByEmail(user.email);

      expect(repositoryMock.findByEmail).toHaveBeenCalledWith(user.email);
      expect(result).toBe(user);
      expect(result).not.toHaveProperty('passwordHash');
    });
  });

  describe('findByEmailWithPassword', () => {
    it('should call repository', async () => {
      const user = UserFactory.makeEntity({ passwordHash: FIXED_PASSWORD_HASH });
      (repositoryMock.findByEmailWithPassword as jest.Mock).mockResolvedValue(user);

      const result = await service.findByEmailWithPassword(user.email);

      expect(repositoryMock.findByEmailWithPassword).toHaveBeenCalledWith(user.email);
      expect(result).toBe(user);
      expect(result).toHaveProperty('passwordHash');
    });
  });
});
