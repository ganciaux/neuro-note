import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { IsEnumType } from '../../../common/validators/is-enum-type.validator';
import { Trim } from '../../../common/helpers/trim.helper';

export class CreateUserDto {
  @IsEmail()
  @Trim()
  @MaxLength(256)
  email: string;

  @IsString()
  @Trim()
  @MinLength(8)
  @MaxLength(64)
  password: string;

  @IsString()
  @Trim()
  @IsEnumType('user_role')
  @MaxLength(128)
  roleCode: string;

  @IsString()
  @Trim()
  @MinLength(1)
  @MaxLength(256)
  lastName: string;

  @IsString()
  @Trim()
  @MinLength(1)
  @MaxLength(256)
  firstName: string;

  @IsString()
  @Trim()
  @MinLength(1)
  @MaxLength(256)
  userName: string;
}
