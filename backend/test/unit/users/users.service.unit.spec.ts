import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import slugify from 'slugify';
import { UsersService } from '../../../src/modules/users/services/users.service';
import { UsersRepository } from '../../../src/modules/users/repositories/users.repository';
import { createServiceTestModule } from '../mocks/service-test-helper';
import { UserFactory } from '../../../src/common/factories/user.factory';
import { createUsersRepositoryMock } from '../mocks/user-repository.mock';
import { UserResponseDto } from '../../../src/modules/users/dto/user-response.dto';
import { toDto, toDtoArray } from '../../../src/common/utils/transform-to-dto';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('UsersService Unit Tests', () => {
  let service: UsersService;
  let repositoryMock: any;

  beforeEach(async () => {
    const customMock = createUsersRepositoryMock();
    ({ service, repositoryMock } = await createServiceTestModule(
      UsersService,
      UsersRepository,
      customMock,
    ));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repositoryMock).toBeDefined();
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const date = new Date();
      const id = 'generated-uuid-123';
      const passwordHash = 'passwordHash';
      const userName = 'createUser';
      const slug = `${slugify(userName)}-abcd`;
      const dto = UserFactory.makeCreateDto({ userName });
      const entityForCreate = UserFactory.makeEntityForCreate({
        ...dto,
        passwordHash,
        slug,
      });
      const savedEntity = UserFactory.makeEntity({
        ...entityForCreate,
        id,
        createdAt: date,
        updatedAt: date,
      });

      (bcrypt.hash as jest.Mock).mockResolvedValue(passwordHash);
      (repositoryMock.findByEmail as jest.Mock).mockResolvedValue(null);
      (repositoryMock.create as jest.Mock).mockReturnValue(entityForCreate);
      (repositoryMock.save as jest.Mock).mockResolvedValue(savedEntity);

      const result = await service.create(dto);

      expect(repositoryMock.findByEmail).toHaveBeenCalledWith(dto.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
      expect(repositoryMock.create).toHaveBeenCalled();
      expect(repositoryMock.save).toHaveBeenCalledWith(
        expect.objectContaining({
          email: dto.email,
          passwordHash,
          slug,
        }),
      );

      expect(result.id).toBe(id);
      expect(result.email).toBe(dto.email);
      expect(result).not.toHaveProperty('password');
      expect(result).not.toHaveProperty('passwordHash');
      expect(result.slug).toBe(slug);
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

  describe('findActiveAdmins', () => {
    it('should return admin list', async () => {
      const admins = [UserFactory.makeEntity()];

      (repositoryMock.findActiveAdmins as jest.Mock).mockResolvedValue(admins);

      const result = await service.findActiveAdmins();

      expect(result.length).toBe(1);
      expect(repositoryMock.findActiveAdmins).toHaveBeenCalled();
      expect(result).toEqual(toDtoArray(UserResponseDto, admins));
    });
  });

  describe('validatePassword', () => {
    it('should return true if password matches', async () => {
      const password = 'password';
      const passwordHash = 'passwordHash';
      const user = UserFactory.makeEntity({ passwordHash });

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validatePassword(user, password);

      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.passwordHash);
    });

    it('should return false if password mismatch', async () => {
      const password = 'password';
      const passwordHash = 'passwordHash';
      const user = UserFactory.makeEntity({ passwordHash});

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validatePassword(user, password);
      expect(result).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.passwordHash);
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
      const passwordHash = 'passwordHash';
      const user = UserFactory.makeEntity({ passwordHash});
      (repositoryMock.findByEmailWithPassword as jest.Mock).mockResolvedValue(user);

      const result = await service.findByEmailWithPassword(user.email);

      expect(repositoryMock.findByEmailWithPassword).toHaveBeenCalledWith(user.email);
      expect(result).toBe(user);
      expect(result).toHaveProperty('passwordHash');
    });
  });
});
