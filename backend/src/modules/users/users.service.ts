import { Injectable, NotFoundException  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepo.create(createUserDto);
    return this.userRepo.save(user); 
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

async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
  const user = await this.userRepo.findOneBy({ id });
  if (!user) throw new NotFoundException(`User ${id} not found`);

  Object.assign(user, updateUserDto);
  return this.userRepo.save(user);
}

  async remove(id: number): Promise<void> {
    await this.userRepo.delete(id);
  }
}
