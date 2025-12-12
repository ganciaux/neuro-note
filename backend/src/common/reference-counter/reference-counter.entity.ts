import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('reference_counters')
@Unique(['entityType', 'year'])
export class ReferenceCounter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'entity_type', length: 128 })
  entityType: string;

  @Column()
  year: number;

  @Column({ default: 0 })
  counter: number;
}
