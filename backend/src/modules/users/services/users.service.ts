import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { UsersRepository } from '../repositories/users.repository';
import { CatchTypeOrmError } from '../../../common/decorators/catch-typeorm-error.decorator';
import { toDto, toDtoArray } from '../../../common/utils/transform-to-dto';
import { BaseService } from '../../../common/base/base.service';
import { generateSlug } from '../../../common/utils/slug.util';

@Injectable()
export class UsersService extends BaseService<User, UserResponseDto, CreateUserDto, UpdateUserDto> {
  protected readonly responseDtoClass = UserResponseDto;
  protected readonly idKey: keyof User = 'id';
  protected readonly entityLabel = 'User';
  protected alias = 'user';

  constructor(private readonly userRepo: UsersRepository) {
    super(userRepo);
  }

  @CatchTypeOrmError()
  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existing = await this.userRepo.findByEmail(createUserDto.email);
    if (existing) {
      throw new ConflictException(`Email ${createUserDto.email} already exists`);
    }

    const slug = generateSlug(createUserDto.userName);

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepo.create({
      ...createUserDto,
      slug,
      passwordHash: hashedPassword,
    });

    const savedUser = await this.userRepo.save(user);

    return toDto(UserResponseDto, savedUser);
  }

  async findBySlug(slug: string): Promise<UserResponseDto> {
    const user = await this.userRepo.findBySlug(slug);
    if (!user) {
      throw new NotFoundException(`User with slug ${slug} not found`);
    }
    return toDto(UserResponseDto, user);
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
