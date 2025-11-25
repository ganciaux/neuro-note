import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'entity_type', length: 128 })
  entityType: string;

  @Column({ name: 'entity_id', length: 128 })
  entityId: string;

  @Column({ name: 'type_code', length: 128 })
  typeCode: string;

  @Column({ name: 'street', length: 256 })
  street: string;

  @Column({ name: 'postal_code', length: 256 })
  postalCode: string;

  @Column({ name: 'city', length: 256 })
  city: string;

  @Column({ name: 'country_code', length: 128 })
  countryCode: string;

  @Column({ name: 'label', length: 256 })
  label: string;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'now()' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'now()' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
