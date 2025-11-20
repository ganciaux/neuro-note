import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from '../repositories/users.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { CatchTypeOrmError } from '../../../common/decorators/catch-typeorm-error.decorator';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: UsersRepository,
  ) {}

  @CatchTypeOrmError()
  async create(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.userRepo.findByEmail(createUserDto.email);
    if (existing) {
      throw new ConflictException(
        `Email ${createUserDto.email} already exists`,
      );
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepo.create({
      ...createUserDto,
      passwordHash: hashedPassword,
    });

    return this.userRepo.save(user);
  }

  @CatchTypeOrmError()
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    Object.assign(user, updateUserDto);
    return this.userRepo.save(user);
  }

  @CatchTypeOrmError()
  async remove(id: number): Promise<void> {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    await this.userRepo.delete(id);
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findByEmail(email);
  }

  async findActiveAdmins(): Promise<User[]> {
    return this.userRepo.findActiveAdmins();
  }

  async search(filters: { email?: string; name?: string }): Promise<User[]> {
    return this.userRepo.search(filters);
  }

  async searchTerm(term: string): Promise<User[]> {
    return this.userRepo.searchTerm(term);
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.passwordHash);
  }

  async login(email: string, password: string): Promise<User> {
    const user = await this.userRepo.findByEmailWithPassword(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    delete (user as any).passwordHash;

    return user;
  }
}
