import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Patient } from '../entities/patient.entity';

@Injectable()
export class PatientsRepository extends Repository<Patient> {
  constructor(private readonly dataSource: DataSource) {
    super(Patient, dataSource.createEntityManager());
  }
}
