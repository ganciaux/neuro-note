import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceDto } from './create-service.dto';
import { IsArray, IsNumber, IsOptional, IsUUID, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateServiceDto extends PartialType(CreateServiceDto) {}

export class UpdateBundleItemDto {
  @IsUUID()
  serviceId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class UpdateBundleItemsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateBundleItemDto)
  @IsOptional()
  add?: UpdateBundleItemDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateBundleItemDto)
  @IsOptional()
  update?: UpdateBundleItemDto[];

  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  delete?: string[];
}