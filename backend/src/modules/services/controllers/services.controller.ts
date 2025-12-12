import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ServicesService } from '../services/services.service';
import { BaseController } from '../../../common/base/base.controller';
import { Service } from '../entities/service.entity';
import { UpdateBundleItemsDto, UpdateServiceDto } from '../dto/update-service.dto';
import { CreateServiceDto } from '../dto/create-service.dto';
import { PermissionActions } from '../../../common/types/permissions.types';
import { JwtUser } from '../../../modules/auth/models';
import { ServiceResponseDto } from '../dto/service-response.dto';
import { UsePermission } from '../../../common/decorators/use-permission.decorator';

export type ServicePermissionActions =
  | PermissionActions
  | 'findOneExtended'
  | 'createBundleWithItems'
  | 'updateBundleWithItems';

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
  >;

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
    return this.servicesService.createBundleWithItems(createServiceDto);
  }

  @Patch('bundle-with-items/:id')
  @UsePermission('updateBundleWithItems')
  async updateBundleWithItems(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() bundleItemDto: UpdateBundleItemsDto,
  ): Promise<ServiceResponseDto> {
    return this.servicesService.updateBundleItems(id, bundleItemDto);
  }
}
