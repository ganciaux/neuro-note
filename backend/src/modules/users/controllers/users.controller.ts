import { Controller, Get, Param, Query } from '@nestjs/common';
import { BaseController } from '../../../common/base/base.controller';
import { toDto } from '../../../common/utils/transform-to-dto';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { FilterUserDto } from '../dto/filter-user.dto';
import { UsersService } from '../services/users.service';
import { JwtUser } from '../../auth/models/jwt-user.model';
import { PermissionActions } from '../../../common/types/permissions.types';
import { UsePermission } from '../../../common/decorators/use-permission.decorator';

export type UserPermissionActions = PermissionActions | 'findBySlug' | 'searchUsers';

@Controller('users')
export class UsersController extends BaseController<
  User,
  UserResponseDto,
  CreateUserDto,
  UpdateUserDto
> {
  protected readonly createDtoClass = CreateUserDto;
  protected readonly updateDtoClass = UpdateUserDto;
  protected readonly responseDtoClass = UserResponseDto;

  protected static permissions: Record<
    PermissionActions,
    (user: JwtUser, request?: any) => boolean
  >;

  constructor(private readonly usersService: UsersService) {
    super(usersService);
  }

  @Get('u/:slug')
  @UsePermission('findBySlug')
  findBySlug(@Param('slug') slug: string): Promise<UserResponseDto> {
    return this.usersService.findBySlug(slug);
  }

  @Get('search')
  @UsePermission('findBySlug')
  async searchUsers(@Query() query: FilterUserDto) {
    const [entities, total] = await this.usersService.search(query);
    return {
      data: entities.map((e) => toDto(UserResponseDto, e)),
      meta: {
        page: query.page,
        limit: query.limit,
        total,
      },
    };
  }
}
