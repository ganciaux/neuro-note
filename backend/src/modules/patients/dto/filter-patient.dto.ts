import { IsOptional, ValidateNested } from 'class-validator';
import { FilterOptionsDto } from '../../../common/query-filters/filter-options.dto';
import { Type } from 'class-transformer';
import { FilterFieldDto } from '../../../common/query-filters/filter-field.dto';
import { Filterable } from '../../../common/query-filters/filter.decorators';
import { FilterOperator } from '../../../common/query-filters/filter-operators.enum';

export class PatientFilterDto extends FilterOptionsDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterFieldDto)
  @Filterable([FilterOperator.LIKE])
  lastName?: FilterFieldDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => FilterFieldDto)
  @Filterable([FilterOperator.EQ, FilterOperator.LIKE])
  firstName?: FilterFieldDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => FilterFieldDto)
  @Filterable([FilterOperator.EQ, FilterOperator.GT, FilterOperator.LT, FilterOperator.BETWEEN])
  birthDate?: FilterFieldDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => FilterFieldDto)
  @Filterable([FilterOperator.EQ])
  phone?: FilterFieldDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => FilterFieldDto)
  @Filterable([FilterOperator.EQ, FilterOperator.LIKE])
  email?: FilterFieldDto;
}
