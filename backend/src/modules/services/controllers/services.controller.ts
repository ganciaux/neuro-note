import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ServicesService } from '../services/services.service';
import { BaseController } from '../../../common/base/base.controller';
import { Service } from '../entities/service.entity';
import { UpdateServiceDto } from '../dto/update-service.dto';
import { CreateServiceDto } from '../dto/create-service.dto';
import { PermissionActions } from '../../../common/types/permissions.types';
import { JwtUser } from '../../../modules/auth/models';
import { ServiceResponseDto } from '../dto/service-response.dto';
import { UsePermission } from '../../../common/decorators/use-permission.decorator';

export type ServicePermissionActions =
  | PermissionActions
  | 'createBundleWithItems'
  | 'findOneExtended';

@Controller('services')
export class ServicesController extends BaseController<
  Service,
  ServiceResponseDto,
  CreateServiceDto,
  UpdateServiceDto
> {
  protected readonly createDtoClass = CreateServiceDto;
  protected readonly updateDtoClass = UpdateServiceDto;
  protected readonly responseDtoClass = ServiceResponseDto;

  protected static permissions: Record<
    ServicePermissionActions,
    (user: JwtUser, request?: any) => boolean
  > = {
    create: (user: JwtUser) => false,
    findAll: (user: JwtUser) => true,
    count: (user: JwtUser) => false,
    findDeleted: (user: JwtUser) => false,
    search: (user: JwtUser) => false,
    softDelete: (user: JwtUser) => false,
    restore: (user: JwtUser) => false,
    findOne: (user: JwtUser) => true,
    update: (user: JwtUser) => false,
    delete: (user: JwtUser) => false,
    createBundleWithItems: (user: JwtUser) => true,
    findOneExtended: (user: JwtUser) => true,
  };

  constructor(private readonly servicesService: ServicesService) {
    super(servicesService);
  }

  @Get('details/:id')
  @UsePermission('findOneExtended')
  findOneExtended(@Param('id', new ParseUUIDPipe()) id: string): Promise<ServiceResponseDto> {
    return this.servicesService.findOneExtended(id);
  }

  @Post('bundle-with-items')
  @UsePermission('createBundleWithItems')
  async createBundleWithItems(
    @Body() createServiceDto: CreateServiceDto,
  ): Promise<ServiceResponseDto> {
    console.log('Creating service bundle with items:', createServiceDto);
    return this.servicesService.createBundleWithItems(createServiceDto);
  }
}
