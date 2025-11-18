import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('enum_types')
@Unique(['type', 'shortCode'])
export class EnumType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 64 })
    type: string;

    @Column({ length: '128', unique: true })
    code: string;

    @Column({ name: 'short_code', length: 64 })
    shortCode: string;

    @Column({ length: 256 })
    label: string;
}
