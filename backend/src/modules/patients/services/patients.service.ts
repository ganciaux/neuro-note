import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';
import { PatientResponseDto } from '../dto/patient-response.dto';
import { PatientsRepository } from '../repositories/patients.repository';
import { toDto, toDtoArray } from '../../../common/utils/transform-to-dto';
import { CatchTypeOrmError } from '../../../common/decorators/catch-typeorm-error.decorator';
import { attachRelation } from '../../../common/utils/attach-relation.utils';
import { AddressesRepository } from '../../addresses/repositories/addresses.repository';

@Injectable()
export class PatientsService {
  constructor(
    private readonly patientRepo: PatientsRepository,
    private readonly addressRepo: AddressesRepository,
  ) {}

  @CatchTypeOrmError()
  async create(createPatientDto: CreatePatientDto): Promise<PatientResponseDto> {
    const patient = this.patientRepo.create(createPatientDto);
    const savedPatient = await this.patientRepo.save(patient);
    return toDto(PatientResponseDto, savedPatient);
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
    await attachRelation(this.addressRepo, patient, 'addresses', 'address_entity_patient');
    return toDto(PatientResponseDto, patient);
  }

  @CatchTypeOrmError()
  async update(id: string, updatePatientDto: UpdatePatientDto): Promise<PatientResponseDto> {
    const patient = await this.patientRepo.findOneBy({ id });
    if (!patient) throw new NotFoundException(`patient #${id} not found`);
    Object.assign(patient, updatePatientDto);
    const updatedPatient = await this.patientRepo.save(patient);
    await attachRelation(this.addressRepo, updatedPatient, 'addresses', 'address_entity_patient');
    return toDto(PatientResponseDto, updatedPatient);
  }

  @CatchTypeOrmError()
  async remove(id: string): Promise<void> {
    const patient = await this.patientRepo.findOneBy({ id });
    if (!patient) throw new NotFoundException(`patient #${id} not found`);
    await this.patientRepo.delete(id);
  }
}
