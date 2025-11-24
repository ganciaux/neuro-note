import { Injectable } from '@nestjs/common';
import { Address } from '../entities/address.entity';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';
import { AddressResponseDto } from '../dto/address-response.dto';
import { AddressesRepository } from '../repositories/addresses.repository';
import { BaseService } from '../../../common/base/base.service';

@Injectable()
export class AddressesService extends BaseService<
  Address,
  AddressResponseDto,
  CreateAddressDto,
  UpdateAddressDto
> {
  protected readonly responseDtoClass = AddressResponseDto;
  protected readonly idKey: keyof Address = 'id';
  protected readonly entityLabel = 'Address';

  constructor(private readonly addressRepo: AddressesRepository) {
    super(addressRepo);
  }

  async deleteByEntity(entityType: string, entityId: string): Promise<void> {
    /*
    const now = new Date();
    await this.addressRepo.update(
        { entity_type: entityType, entity_id: entityId },
        { deleted_at: now }
    );
    */
    console.log(`Deleting addresses for entityType: ${entityType}, entityId: ${entityId}`);
    await this.addressRepo.delete({ entityType: entityType, entityId: entityId });
  }
}
