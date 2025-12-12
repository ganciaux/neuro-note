import { Controller, Get, Query } from '@nestjs/common';
import { BaseController } from '../../../common/base/base.controller';
import { toDto } from '../../../common/utils/transform-to-dto';
import { Address } from '../entities/address.entity';
import { AddressResponseDto } from '../dto/address-response.dto';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';
import { AddressesService } from '../services/addresses.service';
import { FilterAddressDto } from '../dto/filter-address.dto';
import { JwtUser } from '../../../modules/auth/models';
import { PermissionActions } from '../../../common/types/permissions.types';
import { UsePermission } from '../../../common/decorators/use-permission.decorator';

export type AddressPermissionActions = PermissionActions | 'searchAddresses';

@Controller('addresses')
export class AddressesController extends BaseController<
  Address,
  AddressResponseDto,
  CreateAddressDto,
  UpdateAddressDto
> {
  protected readonly createDtoClass = CreateAddressDto;
  protected readonly updateDtoClass = UpdateAddressDto;
  protected readonly responseDtoClass = AddressResponseDto;

  protected static permissions: Record<
    PermissionActions,
    (user: JwtUser, request?: any) => boolean
  >;

  constructor(private readonly addressesService: AddressesService) {
    super(addressesService);
  }

  @Get('search')
  @UsePermission('searchAddresses')
  async searchAddresses(@Query() query: FilterAddressDto) {
    const [entities, total] = await this.addressesService.search(query);
    return {
      data: entities.map((e) => toDto(AddressResponseDto, e)),
      meta: {
        page: query.page,
        limit: query.limit,
        total,
      },
    };
  }
}
