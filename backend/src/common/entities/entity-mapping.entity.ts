import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'entity_mapping' })
export class EntityMapping {
  @PrimaryColumn()
  code: string;

  @Column({ name: 'table_name' })
  tableName: string;

  @Column({ name: 'id_column', nullable: true })
  idColumn?: string;
}
