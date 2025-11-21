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

  async search(filters: {
    email?: string;
    firstName?: string;
    lastName?: string;
  }): Promise<Patient[]> {
    const qb = this.createQueryBuilder('patient');

    if (filters.email) {
      qb.andWhere('LOWER(patient.email) LIKE LOWER(:email)', {
        email: `%${filters.email}%`,
      });
    }

    if (filters.firstName) {
      qb.andWhere('LOWER(patient.firstName) LIKE LOWER(:firstName)', {
        firstName: `%${filters.firstName}%`,
      });
    }

    if (filters.lastName) {
      qb.andWhere('LOWER(patient.lastName) LIKE LOWER(:lastName)', {
        lastName: `%${filters.lastName}%`,
      });
    }

    return qb.getMany();
  }

  async searchTerm(term: string): Promise<Patient[]> {
    return this.createQueryBuilder('patient')
      .where('patient.firstName ILIKE :term', { term: `%${term}%` })
      .orWhere('patient.email ILIKE :term', { term: `%${term}%` })
      .getMany();
  }
}
