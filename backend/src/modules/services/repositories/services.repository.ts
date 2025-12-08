import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Service, ServiceItem } from '../entities/service.entity';
import { CreateServiceDto } from '../dto/create-service.dto';

@Injectable()
export class ServicesRepository extends Repository<Service> {
  constructor(private readonly dataSource: DataSource) {
    super(Service, dataSource.createEntityManager());
  }

  async createBundleWithItems(dto: CreateServiceDto): Promise<Service | null> {
    const service = await this.save(dto);

    console.log('Created service bundle with ID:', service.id);

    if (dto.isBundle && dto.items?.length) {
      const items = dto.items.map(item => ({
        bundleId: service.id,
        serviceId: item.serviceId,
        quantity: item.quantity,
      }));
      await this.dataSource.getRepository(ServiceItem).save(items);
    }

    return this.findOne({
      where: { id: service.id },
      relations: ['items', 'items.service'],
    });
  }
}
