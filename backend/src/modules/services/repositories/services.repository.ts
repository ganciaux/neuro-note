import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Service } from '../entities/service.entity';

@Injectable()
export class ServicesRepository extends Repository<Service> {
  constructor(private readonly dataSource: DataSource) {
    super(Service, dataSource.createEntityManager());
  }
}
