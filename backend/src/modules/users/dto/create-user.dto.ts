import { IsEmail, IsString, Length } from 'class-validator';
import { IsEnumType } from '../../../common/validators/is-enum-type.validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 64)
  password: string;

  @IsString()
  @IsEnumType('user_role', { message: 'roleCode invalide' })
  roleCode: string;

  @IsString()
  fullName: string;
}
