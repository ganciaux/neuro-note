import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { EnumType } from '../entities/enum-type.entity';

@Injectable()
export class EnumTypesRepository extends Repository<EnumType> {
  constructor(private readonly dataSource: DataSource) {
    super(EnumType, dataSource.createEntityManager());
  }

  async findByType(type: string): Promise<EnumType[]> {
    return this.find({ where: { type } });
  }

  async findByTypeAndCode(type: string, code: string): Promise<EnumType[]> {
    return this.find({ where: { type, code } });
  }
}
