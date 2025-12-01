import { UsersService } from '../../../src/modules/users/services/users.service';
import { UsersRepository } from '../../../src/modules/users/repositories/users.repository';
import { createServiceTestModule } from '../mocks/service-test-helper';
import * as bcrypt from 'bcrypt';
import { UserFactory } from '../../../src/common/factories/user.factory';
import { createUsersRepositoryMock } from '../mocks/user-repository.mock';

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
      const dto = UserFactory.makeCreateDto();
      const entity = UserFactory.makeEntity({ email: dto.email });

      (repositoryMock.findByEmail as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');

      (repositoryMock.create as jest.Mock).mockReturnValue(entity);
      (repositoryMock.save as jest.Mock).mockResolvedValue(entity);

      const result = await service.create(dto);

      expect(repositoryMock.findByEmail).toHaveBeenCalledWith(dto.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
      expect(result.email).toBe(dto.email);
      expect(result.id).toBeDefined();
    });

    it('should throw ConflictException if email exists', async () => {
      const dto = UserFactory.makeCreateDto();
      const existingUser = UserFactory.makeEntity({ email: dto.email });

      (repositoryMock.findByEmail as jest.Mock).mockResolvedValue(existingUser);

      await expect(service.create(dto)).rejects.toThrow('already exists');
    });
  });

  describe('findBySlug', () => {
    it('should return user', async () => {
      const entity = UserFactory.makeEntity();

      (repositoryMock.findBySlug as jest.Mock).mockResolvedValue(entity);

      const result = await service.findBySlug(entity.slug);

      expect(result.slug).toBe(entity.slug);
    });

    it('should throw if not found', async () => {
      (repositoryMock.findBySlug as jest.Mock).mockResolvedValue(null);

      await expect(service.findBySlug('unknown')).rejects.toThrow('not found');
    });
  });

  describe('findActiveAdmins', () => {
    it('should return admin list', async () => {
      const admins = [UserFactory.makeEntity()];

      (repositoryMock.findActiveAdmins as jest.Mock).mockResolvedValue(admins);

      const result = await service.findActiveAdmins();

      expect(result.length).toBe(1);
    });
  });

  describe('validatePassword', () => {
    it('should return true if password matches', async () => {
      const user = UserFactory.makeEntity({ passwordHash: 'hash' });

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validatePassword(user, 'pass');
      expect(result).toBe(true);
    });

    it('should return false if password mismatch', async () => {
      const user = UserFactory.makeEntity({ passwordHash: 'hash' });

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validatePassword(user, 'pass');
      expect(result).toBe(false);
    });
  });

  describe('findByEmail', () => {
    it('should call repository', async () => {
      const user = UserFactory.makeEntity();
      (repositoryMock.findByEmail as jest.Mock).mockResolvedValue(user);

      const result = await service.findByEmail(user.email);

      expect(repositoryMock.findByEmail).toHaveBeenCalledWith(user.email);
      expect(result).toBe(user);
    });
  });

  describe('findByEmailWithPassword', () => {
    it('should call repository', async () => {
      const user = UserFactory.makeEntity({ passwordHash: 'hash' });
      (repositoryMock.findByEmailWithPassword as jest.Mock).mockResolvedValue(user);

      const result = await service.findByEmailWithPassword(user.email);

      expect(repositoryMock.findByEmailWithPassword).toHaveBeenCalledWith(user.email);
      expect(result).toBe(user);
    });
  });
});
