import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Service, ServiceItem } from '../entities/service.entity';
import { CreateServiceDto } from '../dto/create-service.dto';

@Injectable()
export class ServicesRepository extends Repository<Service> {
  constructor(private readonly dataSource: DataSource) {
    super(Service, dataSource.createEntityManager());
  }

  get items() {
    return this.dataSource.getRepository(ServiceItem);
  }

  async findWithItems(serviceId: string): Promise<Service | null> {
    return this.findOne({
      where: { id: serviceId },
      relations: ['items', 'items.service', 'parentBundles'],
    });
  }

  async createBundleWithItems(dto: CreateServiceDto): Promise<Service | null> {
    const service = await this.save(dto);

    if (dto.isBundle && dto.items?.length) {
      const items = dto.items.map((item) => ({
        bundleId: service.id,
        serviceId: item.serviceId,
        quantity: item.quantity,
      }));
      await this.items.save(items);
    }

    return this.findWithItems(service.id);
  }
}
