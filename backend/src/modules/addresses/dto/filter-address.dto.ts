import { IsOptional, ValidateNested } from 'class-validator';
import { FilterOptionsDto } from '../../../common/query-filters/filter-options.dto';
import { Type } from 'class-transformer';
import { FilterFieldDto } from '../../../common/query-filters/filter-field.dto';
import { Filterable } from '../../../common/query-filters/filter.decorators';
import { FilterOperator } from '../../../common/query-filters/filter-operators.enum';
import { IsEnumType } from '../../../common/validators/is-enum-type.validator';

export class FilterAddressDto extends FilterOptionsDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterFieldDto)
  @Filterable([FilterOperator.EQ, FilterOperator.IN])
  @IsEnumType('address_entity', { each: true })
  entityType?: FilterFieldDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => FilterFieldDto)
  @Filterable([FilterOperator.EQ])
  entityId?: FilterFieldDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => FilterFieldDto)
  @Filterable([FilterOperator.EQ, FilterOperator.LIKE])
  label?: FilterFieldDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => FilterFieldDto)
  @Filterable([FilterOperator.EQ, FilterOperator.LIKE])
  street?: FilterFieldDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => FilterFieldDto)
  @Filterable([FilterOperator.EQ, FilterOperator.LIKE])
  postalCode?: FilterFieldDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => FilterFieldDto)
  @Filterable([FilterOperator.EQ, FilterOperator.LIKE])
  city?: FilterFieldDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => FilterFieldDto)
  @Filterable([FilterOperator.EQ, FilterOperator.IN])
  @IsEnumType('address_type', { each: true })
  typeCode?: FilterFieldDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => FilterFieldDto)
  @Filterable([FilterOperator.EQ, FilterOperator.IN])
  @IsEnumType('address_country', { each: true })
  countryCode?: FilterFieldDto;
}
