import { Injectable } from '@nestjs/common';
import { Patient } from '../entities/patient.entity';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';
import { PatientResponseDto } from '../dto/patient-response.dto';
import { PatientsRepository } from '../repositories/patients.repository';
import { AddressesRepository } from '../../addresses/repositories/addresses.repository';
import { AddressesService } from '../../addresses/services/addresses.service';
import { attachRelation } from '../../../common/utils/attach-relation.utils';
import { BaseService } from '../../../common/base/base.service';
import { generateSlug } from '../../../common/utils/slug.util';
import { sanitize } from '../../../common/utils/sanitize.utils';

@Injectable()
export class PatientsService extends BaseService<
  Patient,
  PatientResponseDto,
  CreatePatientDto,
  UpdatePatientDto
> {
  protected readonly responseDtoClass = PatientResponseDto;
  protected readonly idKey: keyof Patient = 'id';
  protected readonly entityLabel = 'Patient';
  protected alias = 'patient';

  constructor(
    private readonly patientRepo: PatientsRepository,
    private readonly addressRepo: AddressesRepository,
    private readonly addressService: AddressesService,
  ) {
    super(patientRepo);
  }

  private applyComputedFields(patient: Patient) {
    patient.slug = generateSlug(patient.lastName);
    patient.searchName = sanitize(`${patient.firstName}${patient.lastName}`);
  }

  protected async extendEntity(patient: Patient): Promise<Patient> {
    return attachRelation(this.addressRepo, patient, 'addresses', 'address_entity_patient');
  }

  protected async beforeDelete(patient: Patient): Promise<void> {
    await this.addressService.deleteByEntity('address_entity_patient', patient.id);
  }

  protected async beforeCreate(patient: Patient): Promise<void> {
    this.applyComputedFields(patient);
  }

  protected async beforeUpdate(patient: Patient): Promise<void> {
    this.applyComputedFields(patient);
  }
}
