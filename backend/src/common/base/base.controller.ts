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
  Query,
  UseGuards,
} from '@nestjs/common';
import { BaseService } from './base.service';
import { ObjectLiteral } from 'typeorm';
import { FilterOptionsDto } from '../query-filters/filter-options.dto';
import { toDto } from '../utils/transform-to-dto';
import { UsePermission } from '../decorators/use-permission.decorator';
import { JwtAuthGuard } from '../../../src/modules/auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../guards/permission.guard';

@UseGuards(JwtAuthGuard, PermissionGuard)
export abstract class BaseController<
  Entity extends ObjectLiteral,
  ResponseDto,
  CreateDto,
  UpdateDto,
> {
  protected abstract readonly responseDtoClass: new () => ResponseDto;
  constructor(protected readonly service: BaseService<Entity, ResponseDto, CreateDto, UpdateDto>) {}

  protected beforeCreate?(dto: CreateDto): Promise<void> | void {}
  protected afterCreate?(entity: Entity): Promise<void> | void {}

  protected beforeUpdate?(dto: UpdateDto): Promise<void> | void {}
  protected afterUpdate?(entity: Entity): Promise<void> | void {}

  protected beforeDelete?(id: string): Promise<void> | void {}
  protected afterDelete?(id: string): Promise<void> | void {}

  @Post()
  @UsePermission('create')
  async create(@Body() dto: CreateDto): Promise<ResponseDto> {
    if (this.beforeCreate) await this.beforeCreate(dto);
    const result = await this.service.create(dto);
    if (this.afterCreate) await this.afterCreate(result as unknown as Entity);
    return result;
  }

  @Get()
  @UsePermission('findAll')
  findAll(): Promise<ResponseDto[]> {
    return this.service.findAll();
  }

  @Get('count')
  @UsePermission('count')
  count(): Promise<number> {
    return this.service.count();
  }

  @Get('deleted')
  @UsePermission('findDeleted')
  findDeleted(): Promise<ResponseDto[]> {
    return this.service.findDeleted();
  }

  @Get('search')
  @UsePermission('search')
  async search<FilterDto extends FilterOptionsDto>(@Query() query: FilterDto) {
    const [entities, total] = await this.service.search(query);

    return {
      data: entities.map((e) => toDto(this.responseDtoClass, e)),
      meta: {
        page: query.page,
        limit: query.limit,
        total,
      },
    };
  }

  @Post('soft-delete/:id')
  @UsePermission('softDelete')
  @HttpCode(HttpStatus.NO_CONTENT)
  async softDelete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.service.softDelete(id);
  }

  @Post('restore/:id')
  @UsePermission('restore')
  restore(@Param('id', new ParseUUIDPipe()) id: string): Promise<ResponseDto> {
    return this.service.restore(id);
  }

  @Get(':id')
  @UsePermission('findOne')
  findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<ResponseDto> {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @UsePermission('update')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateDto,
  ): Promise<ResponseDto> {
    if (this.beforeUpdate) await this.beforeUpdate(dto);
    await this.service.findOne(id);
    const result = await this.service.update(id, dto);
    if (this.afterUpdate) await this.afterUpdate(result as unknown as Entity);
    return result;
  }

  @Delete(':id')
  @UsePermission('delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    if (this.beforeDelete) await this.beforeDelete(id);
    const result = await this.service.delete(id);
    if (this.afterDelete) await this.afterDelete(id);
    return result;
  }
}
