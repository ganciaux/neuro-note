import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, DeleteDateColumn  } from 'typeorm';
import { EnumType } from '../../enum-types/entities/enum-type.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 256, unique: true })
    email: string;

    @Column({ name: 'password_hash', length: 256 })
    passwordHash: string;

    @ManyToOne(() => EnumType)
    @JoinColumn({ name: 'role_code', referencedColumnName: 'code' })
    role: EnumType;

    @Column({ name: 'role_code', length : 128 })
    roleCode: string;

    @Column({ name: 'full_name', length: 256 })
    fullName: string;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'now()' })
    createdAt: Date;

    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'now()' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
    deleted_at?: Date;
}
