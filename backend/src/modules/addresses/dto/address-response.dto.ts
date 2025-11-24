import { Expose } from 'class-transformer';

export class AddressResponseDto {
  @Expose()
  id: string;

  @Expose()
  label: string;

  @Expose()
  typeCode: string;

  @Expose()
  street: string;

  @Expose()
  postalCode: string;

  @Expose()
  city: Date;

  @Expose()
  countryCode: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
