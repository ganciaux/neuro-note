import { Expose, Type } from 'class-transformer';

export class ServiceItemResponseDto {
  @Expose()
  serviceId: string;

  @Expose()
  quantity: number;
}

export class ServiceResponseDto {
  @Expose()
  id: string;

  @Expose()
  slug: string;

  @Expose()
  code: string;

  @Expose()
  labelInternal: string;

  @Expose()
  labelInvoice: string;

  @Expose()
  price: number;

  @Expose()
  categoryCode: string;

  @Expose()
  isBundle: boolean;

  @Expose()
  isActive: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => ServiceItemResponseDto)
  items?: ServiceItemResponseDto[];
}
