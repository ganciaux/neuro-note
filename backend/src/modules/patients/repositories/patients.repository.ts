import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Patient } from '../entities/patient.entity';

@Injectable()
export class PatientsRepository extends Repository<Patient> {
  constructor(private readonly dataSource: DataSource) {
    super(Patient, dataSource.createEntityManager());
  }

  async findByEmail(email: string): Promise<Patient | null> {
    return this.findOne({ where: { email } });
  }

  async findBySlug(slug: string): Promise<Patient | null> {
    return this.findOneBy({ slug });
  }
}
