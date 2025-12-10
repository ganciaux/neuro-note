import { Expose, Type } from 'class-transformer';

export class ServiceLightDto {
  @Expose() id: string;
  @Expose() code: string;
  @Expose() labelInternal: string;
  @Expose() slug: string;
}

export class ServiceItemResponseDto {
  @Expose() serviceId: string;
  @Expose() quantity: number;
  @Expose() @Type(() => ServiceLightDto) service: ServiceLightDto;
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

  @Expose()
  @Type(() => ServiceItemResponseDto)
  parentBundles?: ServiceItemResponseDto[];

  @Expose()
  itemCount?: number;
}
