import { Expose } from 'class-transformer';

export class EnumTypeResponseDto {
  @Expose()
  id: string;

  @Expose()
  type: string;

  @Expose()
  code: string;

  @Expose()
  shortCode: string;

  @Expose()
  label: string;
}
