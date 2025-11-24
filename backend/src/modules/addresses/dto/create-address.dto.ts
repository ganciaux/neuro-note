import { IsString, MinLength, MaxLength, IsUUID } from 'class-validator';
import { Trim } from '../../../common/helpers/trim.helper';
import { IsEnumType } from '../../../common/validators/is-enum-type.validator';

export class CreateAddressDto {
  @IsEnumType('address_entity', { message: 'entityType' })
  @IsString()
  @Trim()
  entityType: string;

  @IsUUID()
  entityId: string;

  @IsString()
  @Trim()
  @MinLength(1)
  @MaxLength(256)
  label: string;

  @IsEnumType('address_type', { message: 'typeCode' })
  @IsString()
  @Trim()
  typeCode: string;

  @IsString()
  @Trim()
  @MinLength(1)
  @MaxLength(256)
  street: string;

  @IsString()
  @Trim()
  @MinLength(1)
  @MaxLength(256)
  postalCode: string;

  @IsString()
  @Trim()
  @MinLength(1)
  @MaxLength(256)
  city: string;

  @IsEnumType('address_country', { message: 'countryCode' })
  @IsString()
  @Trim()
  countryCode: string;
}
