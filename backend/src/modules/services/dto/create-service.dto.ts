import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Trim } from '../../../common/helpers/trim.helper';
import { IsEnumType } from '../../../common/validators/is-enum-type.validator';
import { Type } from 'class-transformer';

export class CreateServiceItemDto {
  @IsUUID()
  serviceId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateServiceDto {
  @IsString()
  @Trim()
  @MinLength(1)
  @MaxLength(256)
  code: string;

  @IsEnumType('service_category')
  @IsString()
  @Trim()
  categoryCode: string;

  @IsString()
  @Trim()
  @MinLength(1)
  @MaxLength(256)
  labelInternal: string;

  @IsString()
  @Trim()
  @MinLength(1)
  @MaxLength(256)
  labelInvoice: string;

  @IsNumber()
  price: number;

  @IsBoolean()
  isBundle: boolean;

  @IsBoolean()
  isActive: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateServiceItemDto)
  @IsOptional()
  items?: CreateServiceItemDto[];
}
