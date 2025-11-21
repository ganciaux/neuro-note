import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from '../repositories/users.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { CatchTypeOrmError } from '../../../common/decorators/catch-typeorm-error.decorator';
import { UserResponseDto } from '../dto/user-response.dto';
import { toDto, toDtoArray } from '../../../common/utils/transform-to-dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepo: UsersRepository) {}

  @CatchTypeOrmError()
  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existing = await this.userRepo.findByEmail(createUserDto.email);
    if (existing) {
      throw new ConflictException(`Email ${createUserDto.email} already exists`);
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepo.create({
      ...createUserDto,
      passwordHash: hashedPassword,
    });

    const savedUser = await this.userRepo.save(user);

    return toDto(UserResponseDto, savedUser);
  }

  @CatchTypeOrmError()
  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepo.save(user);

    return toDto(UserResponseDto, updatedUser);
  }

  @CatchTypeOrmError()
  async remove(id: string): Promise<void> {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    await this.userRepo.delete(id);
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return toDto(UserResponseDto, user);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepo.find();
    return toDtoArray(UserResponseDto, users);
  }

  async findBySlug(slug: string): Promise<UserResponseDto> {
    const user = await this.userRepo.findBySlug(slug);
    if (!user) {
      throw new NotFoundException(`User with slug ${slug} not found`);
    }
    return toDto(UserResponseDto, user);
  }

  async findActiveAdmins(): Promise<UserResponseDto[]> {
    const admins = await this.userRepo.findActiveAdmins();
    return toDtoArray(UserResponseDto, admins);
  }

  async search(filters: { email?: string; name?: string }): Promise<UserResponseDto[]> {
    const users = await this.userRepo.search(filters);
    return toDtoArray(UserResponseDto, users);
  }

  async searchTerm(term: string): Promise<UserResponseDto[]> {
    const users = await this.userRepo.searchTerm(term);
    return toDtoArray(UserResponseDto, users);
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    if (!user.passwordHash) throw new Error('Password hash missing');
    return bcrypt.compare(password, user.passwordHash);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findByEmail(email);
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.userRepo.findByEmailWithPassword(email);
  }
}
