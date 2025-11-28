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
import { generateSlug } from 'src/common/utils/slug.util';
import { CatchTypeOrmError } from 'src/common/decorators/catch-typeorm-error.decorator';
import { toDto } from 'src/common/utils/transform-to-dto';

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

  @CatchTypeOrmError()
  async create(createPatientDto: CreatePatientDto): Promise<PatientResponseDto> {
    const slug = generateSlug(createPatientDto.lastName);

    const patient = this.patientRepo.create({
      ...createPatientDto,
      slug,
    });

    const savedPatient = await this.patientRepo.save(patient);

    return toDto(PatientResponseDto, savedPatient);
  }

  protected async extendEntity(patient: Patient): Promise<Patient> {
    return attachRelation(this.addressRepo, patient, 'addresses', 'address_entity_patient');
  }

  protected async beforeDelete(patient: Patient): Promise<void> {
    await this.addressService.deleteByEntity('address_entity_patient', patient.id);
  }
}
