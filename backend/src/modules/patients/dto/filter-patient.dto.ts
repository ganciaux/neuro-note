import {
  IsDate,
  IsOptional,
  IsString,
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

export class FilterPatientDto extends FilterOptionsDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterFieldDto)
  @FilterField({
    operators: [FilterOperator.EQ, FilterOperator.LIKE],
    rules: [IsString()],
  })
  @FilterEnum('patient_title')
  titleCode: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => FilterFieldDto)
  @FilterField({
    operators: [FilterOperator.EQ, FilterOperator.LIKE],
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
    operators: [FilterOperator.EQ, FilterOperator.GT, FilterOperator.LT, FilterOperator.BETWEEN],
    rules: [IsDate()],
  })
  birthDate?: FilterFieldDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => FilterFieldDto)
  @FilterField({
    operators: [FilterOperator.EQ],
    rules: [IsString(), Trim(), MinLength(1), MaxLength(256)],
  })
  phone?: FilterFieldDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => FilterFieldDto)
  @FilterField({
    operators: [FilterOperator.EQ],
    rules: [Trim(), IsString()],
  })
  email?: FilterFieldDto;
}
