import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Service, ServiceItem } from '../entities/service.entity';

@Injectable()
export class ServicesRepository extends Repository<Service> {
  constructor(private readonly dataSource: DataSource) {
    super(Service, dataSource.createEntityManager());
  }

  get items() {
    return this.dataSource.getRepository(ServiceItem);
  }

  async findWithItems(serviceId: string): Promise<Service | null> {
    const service = await this.findOne({
      where: { id: serviceId },
      relations: ['items', 'items.service', 'parentBundles'],
    });

    if (!service) throw new NotFoundException(`Service #${serviceId} not found`);
    return service;
  }
}
