import { IsOptional, ValidateNested } from 'class-validator';
import { FilterOptionsDto } from '../../../common/query-filters/filter-options.dto';
import { Type } from 'class-transformer';
import { FilterFieldDto } from '../../../common/query-filters/filter-field.dto';
import { Filterable } from '../../../common/query-filters/filter.decorators';
import { FilterOperator } from '../../../common/query-filters/filter-operators.enum';
import { IsEnumType } from '../../../common/validators/is-enum-type.validator';

export class FilterUserDto extends FilterOptionsDto {
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
  @Filterable([FilterOperator.EQ, FilterOperator.LIKE])
  userName?: FilterFieldDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => FilterFieldDto)
  @Filterable([FilterOperator.EQ, FilterOperator.LIKE])
  email?: FilterFieldDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => FilterFieldDto)
  @Filterable([FilterOperator.EQ, FilterOperator.IN])
  @IsEnumType('user_role')
  roleCode?: FilterFieldDto;
}
