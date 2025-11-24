import { Controller } from '@nestjs/common';
import { BaseController } from '../../../common/base/base.controller';
import { Address } from '../entities/address.entity';
import { AddressResponseDto } from '../dto/address-response.dto';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';
import { AddressesService } from '../services/addresses.service';

@Controller('addresses')
export class AddressesController extends BaseController<
  Address,
  AddressResponseDto,
  CreateAddressDto,
  UpdateAddressDto
> {
  constructor(private readonly addressesService: AddressesService) {
    super(addressesService);
  }
}
