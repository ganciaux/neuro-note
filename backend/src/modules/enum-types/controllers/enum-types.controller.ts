import { Controller, Get, Param } from '@nestjs/common';
import { BaseController } from '../../../common/base/base.controller';
import { EnumType } from '../entities/enum-type.entity';
import { EnumTypeResponseDto } from '../dto/enum-type-response.dto';
import { CreateEnumTypeDto } from '../dto/create-enum-type.dto';
import { UpdateEnumTypeDto } from '../dto/update-enum-type.dto';
import { EnumTypesService } from '../services/enum-types.service';
import { UsePermission } from '../../../common/decorators/use-permission.decorator';
import { PermissionActions } from '../../../common/types/permissions.types';

export type EnumTypePermissionActions = PermissionActions | 'findByType';

@Controller('enums')
export class EnumTypesController extends BaseController<
  EnumType,
  EnumTypeResponseDto,
  CreateEnumTypeDto,
  UpdateEnumTypeDto
> {
  protected readonly createDtoClass = CreateEnumTypeDto;
  protected readonly updateDtoClass = UpdateEnumTypeDto;
  protected readonly responseDtoClass = EnumTypeResponseDto;

  constructor(private readonly enumService: EnumTypesService) {
    super(enumService);
  }

  @Get('type/:type')
  @UsePermission('findByType')
  findByType(@Param('type') type: string): Promise<EnumTypeResponseDto[]> {
    return this.enumService.findByType(type);
  }
}
