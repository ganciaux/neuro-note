import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';
import { PatientResponseDto } from '../dto/patient-response.dto';
import { PatientsRepository } from '../repositories/patients.repository';
import { toDto, toDtoArray } from '../../../common/utils/transform-to-dto';
import { CatchTypeOrmError } from '../../../common/decorators/catch-typeorm-error.decorator';

@Injectable()
export class PatientsService {
  constructor(private readonly patientRepo: PatientsRepository) {}

  @CatchTypeOrmError()
  async create(createPatientDto: CreatePatientDto): Promise<PatientResponseDto> {
    const patient = this.patientRepo.create(createPatientDto);
    const savedPatient = await this.patientRepo.save(patient);
    return toDto(PatientResponseDto, patient);
  }

  async findAll(): Promise<PatientResponseDto[]> {
    const patients = await this.patientRepo.find();
    return toDtoArray(PatientResponseDto, patients);
  }

  async findOne(id: string): Promise<PatientResponseDto> {
    const patient = await this.patientRepo.findOneBy({ id });
    if (!patient) {
      throw new NotFoundException(`Patient #${id} not found`);
    }
    //await attachRelation(addressRepo, patient, 'addresses', 'patient');
    return toDto(PatientResponseDto, patient);
  }

  @CatchTypeOrmError()
  async update(id: string, updatePatientDto: UpdatePatientDto): Promise<PatientResponseDto> {
    const patient = await this.patientRepo.findOneBy({ id });
    if (!patient) throw new NotFoundException(`patient #${id} not found`);
    Object.assign(patient, updatePatientDto);
    const updatedpatient = await this.patientRepo.save(patient);

    return toDto(PatientResponseDto, updatedpatient);
  }

  @CatchTypeOrmError()
  async remove(id: string): Promise<void> {
    const patient = await this.patientRepo.findOneBy({ id });
    if (!patient) throw new NotFoundException(`patient #${id} not found`);
    await this.patientRepo.delete(id);
  }
}
