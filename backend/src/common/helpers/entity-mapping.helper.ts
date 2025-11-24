import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { EntityMapping } from '../entities/entity-mapping.entity';

@Injectable()
export class EntityMappingHelper {
  constructor(private dataSource: DataSource) {}

  private async getMapping(entityType: string): Promise<EntityMapping | null> {
    return await this.dataSource.getRepository(EntityMapping).findOneBy({ code: entityType });
  }

  async getRepositoryFor(entityType: string): Promise<Repository<any>> {
    const mapping = await this.getMapping(entityType);
    if (!mapping) throw new Error(`Unknown entityType ${entityType}`);

    return this.dataSource.getRepository(mapping.tableName);
  }

  async exists(entityType: string, entityId: string): Promise<boolean> {
    const mapping = await this.getMapping(entityType);
    if (!mapping) return false;

    const idColumn: string = mapping.idColumn || 'id';
    const targetRepo = this.dataSource.getRepository(mapping.tableName);
    const result = await targetRepo.findOne({ where: { [idColumn]: entityId } });

    return !!result;
  }
}
