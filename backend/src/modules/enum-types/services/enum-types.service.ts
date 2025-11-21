import { Injectable, NotFoundException } from '@nestjs/common';
import { EnumTypesRepository } from '../repositories/enum-types.repository';
import { toDto, toDtoArray } from '../../../common/utils/transform-to-dto';
import { EnumTypeResponseDto } from '../dto/enum-types-response.dto';

@Injectable()
export class EnumTypesService {
  constructor(private readonly enumRepo: EnumTypesRepository) {}

  async findOne(id: string): Promise<EnumTypeResponseDto> {
    const enumType = await this.enumRepo.findOneBy({ id });
    if (!enumType) {
      throw new NotFoundException(`enumType #${id} not found`);
    }
    return toDto(EnumTypeResponseDto, enumType);
  }

  async findAll(): Promise<EnumTypeResponseDto[]> {
    const enumTypes = await this.enumRepo.find();
    return toDtoArray(EnumTypeResponseDto, enumTypes);
  }

  async findByType(type: string): Promise<EnumTypeResponseDto[]> {
    const enumTypes = await this.enumRepo.findByType(type);
    return toDtoArray(EnumTypeResponseDto, enumTypes);
  }

  async findByTypeAndCode(type: string, code: string): Promise<EnumTypeResponseDto[]> {
    const enumTypes = await this.enumRepo.findByTypeAndCode(type, code);
    if (!enumTypes) {
      throw new NotFoundException(`Enum value not found for type "${type}" and code "${code}"`);
    }
    return toDtoArray(EnumTypeResponseDto, enumTypes);
  }
}
