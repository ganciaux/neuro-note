import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';
import { AddressesRepository } from '../repositories/addresses.repository';
import { CatchTypeOrmError } from '../../../common/decorators/catch-typeorm-error.decorator';
import { AddressResponseDto } from '../dto/address-response.dto';
import { toDto, toDtoArray } from '../../../common/utils/transform-to-dto';

@Injectable()
export class AddressesService {
  constructor(private readonly addressRepo: AddressesRepository) {}

  @CatchTypeOrmError()
  async create(createAddressDto: CreateAddressDto): Promise<AddressResponseDto> {
    console.log(createAddressDto);
    const address = await this.addressRepo.save(createAddressDto);
    console.log(address);
    return toDto(AddressResponseDto, address);
  }

  async findAll(): Promise<AddressResponseDto[]> {
    const addresses = await this.addressRepo.find();
    console.log(addresses);
    return toDtoArray(AddressResponseDto, addresses);
  }

  async findOne(id: string): Promise<AddressResponseDto> {
    const address = await this.addressRepo.findOneBy({ id });
    if (!address) {
      throw new NotFoundException(`Address #${id} not found`);
    }

    return toDto(AddressResponseDto, address);
  }

  @CatchTypeOrmError()
  async update(id: string, updateAddressDto: UpdateAddressDto): Promise<AddressResponseDto> {
    const address = await this.addressRepo.findOneBy({ id });
    if (!address) throw new NotFoundException(`address #${id} not found`);
    Object.assign(address, updateAddressDto);
    const updatedAddress = await this.addressRepo.save(address);

    return toDto(AddressResponseDto, updatedAddress);
  }

  @CatchTypeOrmError()
  async remove(id: string): Promise<void> {
    const address = await this.addressRepo.findOneBy({ id });
    if (!address) throw new NotFoundException(`address #${id} not found`);
    await this.addressRepo.delete(id);
  }
}
