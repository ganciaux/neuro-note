import { nanoid } from 'nanoid';
import slugify from 'slugify';
import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn, BeforeInsert } from 'typeorm';

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'title_code', length: 128 })
  titleCode: string;

  @Column({ name: 'first_name', length: 256 })
  firstName: string;

  @Column({ name: 'last_name', length: 256 })
  lastName: string;

  @Column({ name: 'search_last_name', length: 256 })
  searchLastName: string;

  @Column({ name: 'birth_date', type: 'timestamp' })
  birth_date: Date;

  @Column({ length: 256 })
  phone: string;

  @Column({ length: 256 })
  email: string;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'now()' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'now()' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deleted_at?: Date;

  @Column({ unique: true })
  slug: string;

  @BeforeInsert()
  generateSlug() {
    const baseSlug = slugify(this.lastName, { lower: true });
    this.slug = `${baseSlug}-${nanoid(4)}`;
  }
}
