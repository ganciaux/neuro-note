import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReferenceCounter } from './reference-counter.entity';
import { DataSource, Repository } from 'typeorm';
import { EnumType } from '../../../src/modules/enum-types/entities/enum-type.entity';

@Injectable()
export class ReferenceCounterService {
  constructor(
    @InjectRepository(ReferenceCounter)
    private repo: Repository<ReferenceCounter>,
    @InjectRepository(EnumType)
    private enumRepo: Repository<EnumType>,
    private dataSource: DataSource,
  ) {}

  async getNext(entityType: string, year: number): Promise<number> {
    year = year ?? new Date().getFullYear();

    const exists = await this.enumRepo.existsBy({
      type: 'reference_counter',
      code: entityType,
    });

    if (!exists) {
      throw new BadRequestException(`Unknown entityType '${entityType}' for reference_counter`);
    }

    return this.dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(ReferenceCounter);

      let row = await repo
        .createQueryBuilder('rc')
        .setLock('pessimistic_write')
        .where('rc.entityType = :entityType AND rc.year = :year', { entityType, year })
        .getOne();

      if (!row) {
        row = repo.create({ entityType, year, counter: 0 });
      }

      row.counter++;
      await repo.save(row);

      return row.counter;
    });
  }
}
