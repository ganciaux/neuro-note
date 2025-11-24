import {
  Body,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { BaseService } from './base.service';
import { ObjectLiteral } from 'typeorm';

export class BaseController<Entity extends ObjectLiteral, ResponseDto, CreateDto, UpdateDto> {
  constructor(protected readonly service: BaseService<Entity, ResponseDto, CreateDto, UpdateDto>) {}

  protected beforeCreate?(dto: CreateDto): Promise<void> | void {}
  protected afterCreate?(entity: Entity): Promise<void> | void {}

  protected beforeUpdate?(dto: UpdateDto): Promise<void> | void {}
  protected afterUpdate?(entity: Entity): Promise<void> | void {}

  protected beforeDelete?(id: string): Promise<void> | void {}
  protected afterDelete?(id: string): Promise<void> | void {}

  @Post()
  async create(@Body() dto: CreateDto): Promise<ResponseDto> {
    if (this.beforeCreate) await this.beforeCreate(dto);
    const result = await this.service.create(dto);
    if (this.afterCreate) await this.afterCreate(result as unknown as Entity);
    return result;
  }

  @Get()
  findAll(): Promise<ResponseDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<ResponseDto> {
    return this.service.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateDto,
  ): Promise<ResponseDto> {
    if (this.beforeUpdate) await this.beforeUpdate(dto);
    const result = await this.service.update(id, dto);
    if (this.afterUpdate) await this.afterUpdate(result as unknown as Entity);
    return result;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    if (this.beforeDelete) await this.beforeDelete(id);
    const result = await this.service.delete(id);
    if (this.afterDelete) await this.afterDelete(id);
    return result;
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  async softDelete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.service.softDelete(id);
  }

  @Post(':id/restore')
  restore(@Param('id', new ParseUUIDPipe()) id: string): Promise<ResponseDto> {
    return this.service.restore(id);
  }

  @Get('count')
  count(): Promise<number> {
    return this.service.count();
  }

  @Get('deleted')
  findDeleted(): Promise<ResponseDto[]> {
    return this.service.findDeleted();
  }
}
