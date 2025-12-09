import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { EnumType } from '../../enum-types/entities/enum-type.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 256, unique: true })
  email: string;

  @Column({ name: 'password_hash', length: 256, select: false })
  passwordHash: string;

  @ManyToOne(() => EnumType)
  @JoinColumn({ name: 'role_code', referencedColumnName: 'code' })
  role?: EnumType;

  @Column({ name: 'role_code', length: 128 })
  roleCode: string;

  @Column({ name: 'user_name', length: 256 })
  userName: string;

  @Column({ name: 'first_name', length: 256 })
  firstName: string;

  @Column({ name: 'last_name', length: 256 })
  lastName: string;

  @Column({ name: 'created_at', type: 'timestamptz', default: () => 'now()' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamptz', default: () => 'now()' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt?: Date | null;

  @Column({ unique: true, length: 64 })
  slug: string;
}
