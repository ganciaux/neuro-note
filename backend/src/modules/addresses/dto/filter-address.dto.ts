import {
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FilterOptionsDto } from '../../../common/query-filters/filter-options.dto';
import { FilterFieldDto } from '../../../common/query-filters/filter-field.dto';
import { FilterOperator } from '../../../common/query-filters/filter-operators.enum';
import { FilterField } from '../../../common/decorators/filter-field.decorator';
import { Trim } from '../../../common/helpers/trim.helper';
import { FilterEnum } from '../../../common/decorators/filter-enum.decorator';

export class FilterAddressDto extends FilterOptionsDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterFieldDto)
  @FilterField({
    operators: [FilterOperator.EQ, FilterOperator.IN],
    rules: [IsString()],
  })
  @FilterEnum('address_entity')
  entityType?: FilterFieldDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => FilterFieldDto)
  @FilterField({ operators: [FilterOperator.EQ], rules: [IsUUID()] })
  entityId?: FilterFieldDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => FilterFieldDto)
  @FilterField({
    operators: [FilterOperator.EQ],
    rules: [IsString(), Trim(), MinLength(1), MaxLength(256)],
  })
  label?: FilterFieldDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => FilterFieldDto)
  @FilterField({
    operators: [FilterOperator.EQ],
    rules: [IsString(), Trim(), MinLength(1), MaxLength(256)],
  })
  street?: FilterFieldDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => FilterFieldDto)
  @FilterField({
    operators: [FilterOperator.EQ],
    rules: [IsString(), Trim(), MinLength(1), MaxLength(256)],
  })
  postalCode?: FilterFieldDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => FilterFieldDto)
  @FilterField({
    operators: [FilterOperator.EQ],
    rules: [IsString(), Trim(), MinLength(1), MaxLength(256)],
  })
  city?: FilterFieldDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => FilterFieldDto)
  @FilterField({
    operators: [FilterOperator.EQ, FilterOperator.IN],
    rules: [IsString()],
  })
  @FilterEnum('address_type')
  typeCode?: FilterFieldDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => FilterFieldDto)
  @FilterField({
    operators: [FilterOperator.EQ, FilterOperator.IN],
    rules: [IsString()],
  })
  @FilterEnum('address_country')
  countryCode?: FilterFieldDto;
}
