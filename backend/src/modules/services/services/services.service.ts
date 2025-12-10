import { Injectable } from '@nestjs/common';
import { CreateServiceDto } from '../dto/create-service.dto';
import { UpdateBundleItemsDto, UpdateServiceDto } from '../dto/update-service.dto';
import { BaseService } from '../../../common/base/base.service';
import { Service } from '../entities/service.entity';
import { ServiceResponseDto } from '../dto/service-response.dto';
import { ServicesRepository } from '../repositories/services.repository';
import { CatchTypeOrmError } from '../../../common/decorators/catch-typeorm-error.decorator';
import { toDto } from '../../../common/utils/transform-to-dto';

@Injectable()
export class ServicesService extends BaseService<
  Service,
  ServiceResponseDto,
  CreateServiceDto,
  UpdateServiceDto
> {
  protected readonly responseDtoClass = ServiceResponseDto;
  protected readonly idKey: keyof Service = 'id';
  protected readonly entityLabel = 'Service';
  protected alias = 'service';
  protected relations = ['items', 'items.service', 'parentBundles'];

  constructor(private readonly serviceRepo: ServicesRepository) {
    super(serviceRepo);
  }

  protected async extendEntity(service: Service): Promise<Service> {
    const serviceWithItems = await this.serviceRepo.findWithItems(service.id);
    return { ...service, ...serviceWithItems };
  }

  @CatchTypeOrmError()
  async createBundleWithItems(createServiceDto: CreateServiceDto): Promise<ServiceResponseDto> {
    const savedService = await this.serviceRepo.createBundleWithItems(createServiceDto);

    return toDto(ServiceResponseDto, savedService);
  }

  @CatchTypeOrmError()
  async updateBundleItems(
    bundleId: string,
    dto: UpdateBundleItemsDto,
  ): Promise<ServiceResponseDto> {
    const serviceItemsRepo = this.serviceRepo.items;

    if (dto.add?.length) {
      await serviceItemsRepo.insert(
        dto.add.map((a) => ({
          bundleId,
          serviceId: a.serviceId,
          quantity: a.quantity,
        })),
      );
    }

    if (dto.update?.length) {
      for (const u of dto.update) {
        await serviceItemsRepo.update(
          { bundleId, serviceId: u.serviceId },
          { quantity: u.quantity },
        );
      }
    }

    if (dto.delete?.length) {
      await serviceItemsRepo.delete(dto.delete.map((serviceId) => ({ bundleId, serviceId })));
    }

    const service = this.serviceRepo.findWithItems(bundleId);

    return toDto(ServiceResponseDto, service);
  }
}
