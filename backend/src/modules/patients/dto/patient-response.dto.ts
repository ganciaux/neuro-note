import { Expose, Transform, Type } from 'class-transformer';
import { AddressResponseDto } from '../../addresses/dto/address-response.dto';
import { formatDateOnly } from '../../../common/utils/date.utils';

export class PatientResponseDto {
  @Expose()
  id: string;

  @Expose()
  slug: string;

  @Expose()
  titleCode: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  @Transform(({ value }) => formatDateOnly(value))
  birthDate: Date;

  @Expose()
  phone: string;

  @Expose()
  email: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => AddressResponseDto)
  addresses?: AddressResponseDto[];
}
