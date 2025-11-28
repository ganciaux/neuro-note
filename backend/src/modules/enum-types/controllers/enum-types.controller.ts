import { Controller, Get, Param } from '@nestjs/common';
import { BaseController } from '../../../common/base/base.controller';
import { EnumType } from '../entities/enum-type.entity';
import { EnumTypeResponseDto } from '../dto/enum-type-response.dto';
import { CreateEnumTypeDto } from '../dto/create-enum-type.dto';
import { UpdateEnumTypeDto } from '../dto/update-enum-type.dto';
import { EnumTypesService } from '../services/enum-types.service';

@Controller('enums')
export class EnumTypesController extends BaseController<
  EnumType,
  EnumTypeResponseDto,
  CreateEnumTypeDto,
  UpdateEnumTypeDto
> {
  protected readonly responseDtoClass = EnumTypeResponseDto;

  constructor(private readonly enumService: EnumTypesService) {
    super(enumService);
  }

  @Get('type/:type')
  findByType(@Param('type') type: string): Promise<EnumTypeResponseDto[]> {
    return this.enumService.findByType(type);
  }
}
