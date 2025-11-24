import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Address } from '../entities/address.entity';

@Injectable()
export class AddressesRepository extends Repository<Address> {
  constructor(private readonly dataSource: DataSource) {
    super(Address, dataSource.createEntityManager());
  }

  async search(filters: { label?: string }): Promise<Address[]> {
    const qb = this.createQueryBuilder('address');

    if (filters.label) {
      qb.andWhere('LOWER(address.label) LIKE LOWER(:label)', {
        email: `%${filters.label}%`,
      });
    }

    return qb.getMany();
  }

  async searchTerm(term: string): Promise<Address[]> {
    return this.createQueryBuilder('address')
      .where('address.label ILIKE :term', { term: `%${term}%` })
      .getMany();
  }
}
