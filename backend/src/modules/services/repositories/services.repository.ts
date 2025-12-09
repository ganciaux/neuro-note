import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Service, ServiceItem } from '../entities/service.entity';
import { CreateServiceDto } from '../dto/create-service.dto';

@Injectable()
export class ServicesRepository extends Repository<Service> {
  constructor(private readonly dataSource: DataSource) {
    super(Service, dataSource.createEntityManager());
  }

  async findWithItems(serviceId: string): Promise<Service | null> {
    return this.createQueryBuilder('service')
      .leftJoinAndSelect('service.items', 'serviceItem')
      .leftJoinAndSelect('serviceItem.service', 'linkedService')
      .where('service.id = :id', { id: serviceId })
      .getOne();
  }

  async createBundleWithItems(dto: CreateServiceDto): Promise<Service | null> {
    const service = await this.save(dto);

    if (dto.isBundle && dto.items?.length) {
      const items = dto.items.map((item) => ({
        bundleId: service.id,
        serviceId: item.serviceId,
        quantity: item.quantity,
      }));
      await this.dataSource.getRepository(ServiceItem).save(items);
    }

    return this.findWithItems(service.id);
  }

  async updateBundleItems(
    bundleId: string,
    itemsDto: { serviceId: string; quantity: number }[],
  ): Promise<Service | null> {
    const serviceItemRepo = this.dataSource.getRepository(ServiceItem);

    const existingItems = await serviceItemRepo.find({ where: { bundleId } });

    const existingMap = new Map(existingItems.map((i) => [i.serviceId, i]));
    const newMap = new Map(itemsDto.map((i) => [i.serviceId, i]));

    const toAdd: ServiceItem[] = [];
    const toUpdate: ServiceItem[] = [];
    const toDelete: ServiceItem[] = [];

    for (const [serviceId, existingItem] of existingMap.entries()) {
      if (!newMap.has(serviceId)) {
        toDelete.push(existingItem);
      } else {
        const newItem = newMap.get(serviceId)!;
        if (existingItem.quantity !== newItem.quantity) {
          existingItem.quantity = newItem.quantity;
          toUpdate.push(existingItem);
        }
      }
    }

    for (const [serviceId, newItem] of newMap.entries()) {
      if (!existingMap.has(serviceId)) {
        toAdd.push(
          serviceItemRepo.create({
            bundleId,
            serviceId: newItem.serviceId,
            quantity: newItem.quantity,
          }),
        );
      }
    }

    if (toDelete.length) await serviceItemRepo.remove(toDelete);
    if (toUpdate.length) await serviceItemRepo.save(toUpdate);
    if (toAdd.length) await serviceItemRepo.save(toAdd);

    return this.findWithItems(bundleId);
  }
}
