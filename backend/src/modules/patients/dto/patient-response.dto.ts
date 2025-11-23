import { Expose } from 'class-transformer';

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
  birthDate: Date;

  @Expose()
  phone: string;

  @Expose()
  email: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
