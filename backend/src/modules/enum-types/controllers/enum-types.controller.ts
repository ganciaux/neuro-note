import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { EnumTypesService } from '../services/enum-types.service';
import { EnumTypeResponseDto } from '../dto/enum-types-response.dto';

@Controller('enums')
export class EnumTypesController {
  constructor(private readonly enumService: EnumTypesService) {}

  @Get('type/:type')
  findByType(@Param('type') type: string): Promise<EnumTypeResponseDto[]> {
    return this.enumService.findByType(type);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<EnumTypeResponseDto> {
    return this.enumService.findOne(id);
  }

  @Get()
  findAll(): Promise<EnumTypeResponseDto[]> {
    return this.enumService.findAll();
  }
}
