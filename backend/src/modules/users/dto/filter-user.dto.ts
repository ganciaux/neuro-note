import { IsOptional, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { FilterOptionsDto } from '../../../common/query-filters/filter-options.dto';
import { FilterFieldDto } from '../../../common/query-filters/filter-field.dto';
import { FilterOperator } from '../../../common/query-filters/filter-operators.enum';
import { FilterField } from '../../../common/decorators/filter-field.decorator';
import { Trim } from '../../../common/helpers/trim.helper';
import { FilterEnum } from '../../../common/decorators/filter-enum.decorator';

export class FilterUserDto extends FilterOptionsDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterFieldDto)
  @FilterField({
    operators: [FilterOperator.EQ],
    rules: [IsString(), Trim(), MinLength(1), MaxLength(256)],
  })
  lastName?: FilterFieldDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => FilterFieldDto)
  @FilterField({
    operators: [FilterOperator.EQ],
    rules: [IsString(), Trim(), MinLength(1), MaxLength(256)],
  })
  firstName?: FilterFieldDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => FilterFieldDto)
  @FilterField({
    operators: [FilterOperator.EQ],
    rules: [IsString(), Trim(), MinLength(1), MaxLength(256)],
  })
  userName?: FilterFieldDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => FilterFieldDto)
  @FilterField({
    operators: [FilterOperator.EQ],
    rules: [Trim(), IsString()],
  })
  email?: FilterFieldDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => FilterFieldDto)
  @FilterField({
    operators: [FilterOperator.EQ, FilterOperator.IN],
    rules: [IsString()],
  })
  @FilterEnum('user_role')
  roleCode?: FilterFieldDto;
}
