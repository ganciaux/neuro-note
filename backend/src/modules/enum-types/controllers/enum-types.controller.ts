import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EnumTypesService } from '../services/enum-types.service';
import { CreateEnumTypeDto } from '../dto/create-enum-type.dto';
import { UpdateEnumTypeDto } from '../dto/update-enum-type.dto';

@Controller('enum-types')
export class EnumTypesController {
  constructor(private readonly enumTypesService: EnumTypesService) {}

  @Post()
  create(@Body() createEnumTypeDto: CreateEnumTypeDto) {
    return this.enumTypesService.create(createEnumTypeDto);
  }

  @Get()
  findAll() {
    return this.enumTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.enumTypesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEnumTypeDto: UpdateEnumTypeDto) {
    return this.enumTypesService.update(+id, updateEnumTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.enumTypesService.remove(+id);
  }
}
