import { IsEmail, IsString, Length, MaxLength, MinLength } from 'class-validator';
import { Trim } from '../../../common/helpers/trim.helper';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 64)
  password: string;

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
