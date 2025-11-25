import { Type } from 'class-transformer';
import { IsOptional, IsEnum, IsString } from 'class-validator';
import { FilterOperator } from './filter-operators.enum';

export class FilterFieldDto<T = string> {
  @IsOptional()
  @IsEnum(FilterOperator)
  operator?: FilterOperator;

  //EQ, GT, GTE, LT, LTE, LIKE
  @IsOptional()
  @IsString()
  value?: T;

  //IN
  @IsOptional()
  @Type(() => T)
  values?: T[];

  //BETWEEN
  @IsOptional()
  @IsString()
  from?: T;

  @IsOptional()
  @IsString()
  to?: T;
}
