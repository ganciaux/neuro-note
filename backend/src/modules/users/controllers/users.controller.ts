import { Controller, Get, Param } from '@nestjs/common';
import { BaseController } from '../../../common/base/base.controller';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController extends BaseController<
  User,
  UserResponseDto,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(private readonly usersService: UsersService) {
    super(usersService);
  }

  @Get('u/:slug')
  findBySlug(@Param('slug') slug: string): Promise<UserResponseDto> {
    return this.usersService.findBySlug(slug);
  }
}
