import { Type } from 'class-transformer';
import { IsOptional, IsEnum, IsString } from 'class-validator';
import { FilterOperator } from './filter-operators.enum';

export class FilterFieldDto {
  @IsOptional()
  @IsEnum(FilterOperator)
  operator?: FilterOperator;

  //EQ, GT, GTE, LT, LTE, LIKE
  @IsOptional()
  @IsString()
  value?: string;

  //IN
  @IsOptional()
  @Type(() => String)
  values?: string[];

  //BETWEEN
  @IsOptional()
  @IsString()
  from?: string;

  @IsOptional()
  @IsString()
  to?: string;
}
