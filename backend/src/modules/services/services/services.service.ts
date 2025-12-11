import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateServiceDto } from '../dto/create-service.dto';
import { UpdateBundleItemsDto, UpdateServiceDto } from '../dto/update-service.dto';
import { BaseService } from '../../../common/base/base.service';
import { Service } from '../entities/service.entity';
import { ServiceResponseDto } from '../dto/service-response.dto';
import { ServicesRepository } from '../repositories/services.repository';
import { CatchTypeOrmError } from '../../../common/decorators/catch-typeorm-error.decorator';
import { toDto } from '../../../common/utils/transform-to-dto';
import { generateServiceSlug } from '../../../common/utils/slug.util';
import { EntityManager, In } from 'typeorm';

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

  initRelations(service: Service) {
    service.items = service.items ?? [];
    service.parentBundles = service.parentBundles ?? [];
  }

  protected async afterCreate(service: Service): Promise<void> {
    this.initRelations(service);
    return Promise.resolve();
  }

  protected async afterUpdate(service: Service): Promise<void> {
    this.initRelations(service);
    return Promise.resolve();
  }

  protected async applyComputedFields(service: Service) {
    service.slug = generateServiceSlug(service.code);
    return Promise.resolve();
  }

  protected async createRelations(
    service: Service,
    dto: CreateServiceDto,
    manager: EntityManager,
  ): Promise<Partial<Service>> {
    if (dto.isBundle && dto.items?.length) {
      const serviceIds = dto.items.map((i) => i.serviceId);
      const existingServices = await manager.find(Service, { where: { id: In(serviceIds) } });
      const existingIds = new Set(existingServices.map((s) => s.id));

      const invalidItem = dto.items.find((i) => !existingIds.has(i.serviceId));
      if (invalidItem)
        throw new BadRequestException(`Service ${invalidItem.serviceId} does not exist`);

      const items = dto.items.map((i) =>
        this.serviceRepo.items.create({
          bundleId: service.id,
          serviceId: i.serviceId,
          quantity: i.quantity,
        }),
      );

      await manager.save(items);

      return { items };
    }

    return {};
  }

  protected async extendEntity(service: Service): Promise<Service> {
    if (!service) return service;
    const serviceWithItems = await this.serviceRepo.findWithItems(service.id);
    if (!serviceWithItems) return service;

    service.items = serviceWithItems.items;
    service.parentBundles = serviceWithItems.parentBundles;

    return service;
  }

  @CatchTypeOrmError()
  async createBundleWithItems(createServiceDto: CreateServiceDto): Promise<ServiceResponseDto> {
    return this.createWithRelations(createServiceDto, ['items', 'items.service']);
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
