import { Injectable, NotFoundException } from '@nestjs/common';
import { EnumType } from '../entities/enum-type.entity';
import { EnumTypeResponseDto } from '../dto/enum-types-response.dto';
import { CreateEnumTypeDto } from '../dto/create-enum-type.dto';
import { UpdateEnumTypeDto } from '../dto/update-enum-type.dto';
import { EnumTypesRepository } from '../repositories/enum-types.repository';
import { toDtoArray } from '../../../common/utils/transform-to-dto';
import { BaseService } from '../../../common/base/base.service';

@Injectable()
export class EnumTypesService extends BaseService<
  EnumType,
  EnumTypeResponseDto,
  CreateEnumTypeDto,
  UpdateEnumTypeDto
> {
  protected readonly responseDtoClass = EnumTypeResponseDto;
  protected readonly idKey: keyof EnumType = 'id';
  protected readonly entityLabel = 'EnumType';

  constructor(private readonly enumRepo: EnumTypesRepository) {
    super(enumRepo);
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
