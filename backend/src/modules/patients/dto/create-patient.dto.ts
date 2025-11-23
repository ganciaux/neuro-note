import {
  IsString,
  MinLength,
  MaxLength,
  IsDate,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Trim } from '../../../common/helpers/trim.helper';
import { IsEnumType } from '../../../common/validators/is-enum-type.validator';

export class CreatePatientDto {
  @IsEnumType('patient_title', { message: 'titleCode invalide' })
  @IsString()
  @Trim()
  titleCode: string;

  @IsString()
  @Trim()
  @MinLength(1)
  @MaxLength(256)
  firstName: string;

  @IsString()
  @Trim()
  @MinLength(1)
  @MaxLength(256)
  lastName: string;

  @Type(() => Date)
  @IsDate()
  birthDate: Date;

  @Trim()
  @MaxLength(256)
  phone?: string;

  @Trim()
  @IsEmail()
  email?: string;
}
