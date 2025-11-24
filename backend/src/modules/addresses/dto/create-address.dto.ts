import { IsString, MinLength, MaxLength, IsUUID } from 'class-validator';
import { Trim } from '../../../common/helpers/trim.helper';
import { IsEnumType } from '../../../common/validators/is-enum-type.validator';
import { EntityExists } from '../../../common/validators/entity-exists.validator';

export class CreateAddressDto {
  @IsEnumType('address_entity')
  @IsString()
  @Trim()
  entityType: string;

  @IsUUID()
  @EntityExists()
  entityId: string;

  @IsString()
  @Trim()
  @MinLength(1)
  @MaxLength(256)
  label: string;

  @IsEnumType('address_type')
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

  @IsEnumType('address_country')
  @IsString()
  @Trim()
  countryCode: string;
}
