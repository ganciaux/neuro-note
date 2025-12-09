import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'category_code', length: 128 })
  categoryCode: string;

  @Column({ name: 'code', length: 256 })
  code: string;

  @Column({ unique: true, length: 64 })
  slug: string;

  @Column({ name: 'label_internal', length: 256 })
  labelInternal: string;

  @Column({ name: 'label_invoice', length: 256 })
  labelInvoice: string;

  @Column('numeric', { name: 'price' })
  price: number;

  @Column({ name: 'is_bundle', default: false })
  isBundle: boolean;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'created_at', type: 'timestamptz', default: () => 'now()' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamptz', default: () => 'now()' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt?: Date | null;

  @OneToMany(() => ServiceItem, (item) => item.bundle)
  items?: ServiceItem[];

  @OneToMany(() => ServiceItem, (item) => item.service)
  parentBundles?: ServiceItem[];
}

@Entity('service_items')
export class ServiceItem {
  @PrimaryColumn({ name: 'bundle_id', type: 'uuid' })
  bundleId: string;

  @PrimaryColumn({ name: 'service_id', type: 'uuid' })
  serviceId: string;

  @Column({ default: 1 })
  quantity: number;

  @ManyToOne(() => Service, (service) => service.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'bundle_id' })
  bundle: Service;

  @ManyToOne(() => Service, (service) => service.parentBundles)
  @JoinColumn({ name: 'service_id' })
  service: Service;
}
